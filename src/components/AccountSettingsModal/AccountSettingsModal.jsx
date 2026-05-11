import React, { useEffect, useMemo, useState } from 'react'
import './AccountSettingsModal.css'
import { auth, updateAccountEmail, updateAccountPassword, updateAccountProfile } from '../../firebase'
import defaultProfileImg from '../../assets netflix/profile_img.png'
import profileAvatars from '../../lib/profileAvatars'

const getFallbackName = (user) => {
  if (user?.displayName?.trim()) {
    return user.displayName.trim()
  }

  if (user?.email) {
    return user.email.split('@')[0]
  }

  return 'Netflix Member'
}

function AccountSettingsModal({ isOpen, initialSection = 'profile', onClose }) {
  const user = auth.currentUser
  const initialAvatar = user?.photoURL || defaultProfileImg
  const [activeSection, setActiveSection] = useState(initialSection)
  const [editingName, setEditingName] = useState(false)
  const [editingAvatar, setEditingAvatar] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileName, setProfileName] = useState(getFallbackName(user))
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar)
  const [emailDraft, setEmailDraft] = useState(user?.email || '')
  const [emailPassword, setEmailPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const previewName = useMemo(() => profileName.trim() || getFallbackName(user), [profileName, user])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !user) {
    return null
  }

  const cancelNameEdit = () => {
    setEditingName(false)
    setProfileName(getFallbackName(auth.currentUser))
  }

  const cancelAvatarEdit = () => {
    setEditingAvatar(false)
    setSelectedAvatar(auth.currentUser?.photoURL || defaultProfileImg)
  }

  const cancelEmailEdit = () => {
    setEditingEmail(false)
    setEmailDraft(auth.currentUser?.email || '')
    setEmailPassword('')
  }

  const cancelPasswordEdit = () => {
    setEditingPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleProfileSave = async () => {
    const trimmedName = profileName.trim()

    if (!trimmedName) {
      return
    }

    setSaving(true)
    const didSave = await updateAccountProfile({
      displayName: trimmedName,
      photoURL: selectedAvatar,
    })
    setSaving(false)

    if (didSave) {
      setEditingName(false)
      setEditingAvatar(false)
    }
  }

  const handleEmailSave = async () => {
    if (!emailDraft.trim() || !emailPassword.trim()) {
      return
    }

    setSaving(true)
    const didSave = await updateAccountEmail({
      newEmail: emailDraft.trim(),
      currentPassword: emailPassword,
    })
    setSaving(false)

    if (didSave) {
      setEditingEmail(false)
      setEmailPassword('')
    }
  }

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return
    }

    setSaving(true)
    const didSave = await updateAccountPassword({
      currentPassword,
      newPassword,
    })
    setSaving(false)

    if (didSave) {
      cancelPasswordEdit()
    }
  }

  return (
    <div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
      <button className="account-modal__backdrop" type="button" aria-label="Close account settings" onClick={onClose} />

      <div className="account-modal__panel">
        <div className="account-modal__header">
          <div>
            <p className="account-modal__eyebrow">Profile controls</p>
            <h2 id="account-modal-title">Account & Security</h2>
          </div>
          <button className="account-modal__close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="account-modal__body">
          <aside className="account-modal__nav" aria-label="Settings sections">
            <button
              className={activeSection === 'profile' ? 'is-active' : ''}
              type="button"
              onClick={() => setActiveSection('profile')}
            >
              Edit Profile
            </button>
            <button
              className={activeSection === 'security' ? 'is-active' : ''}
              type="button"
              onClick={() => setActiveSection('security')}
            >
              Security
            </button>
          </aside>

          <div className="account-modal__content">
            <section className={`account-modal__section ${activeSection === 'profile' ? 'is-visible' : ''}`}>
              <div className="account-card account-card--hero">
                <div className="account-card__identity">
                  <img src={selectedAvatar} alt={`${previewName} profile icon`} className="account-card__avatar" />
                  <div>
                    <h3>{previewName}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
                <p className="account-card__hint">Update your profile icon and display name without leaving the home screen.</p>
              </div>

              <div className="account-card">
                <div className="account-card__topline">
                  <div>
                    <p className="account-card__label">Change icon</p>
                    <h3>Pick a profile icon</h3>
                  </div>
                  <button type="button" onClick={() => setEditingAvatar((current) => !current)}>
                    {editingAvatar ? 'Hide choices' : 'Edit'}
                  </button>
                </div>

                {editingAvatar ? (
                  <>
                    <div className="account-avatar-grid" role="list" aria-label="Profile icon choices">
                      {profileAvatars.map((avatar) => (
                        <button
                          key={avatar.id}
                          className={selectedAvatar === avatar.src ? 'is-selected' : ''}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.src)}
                        >
                          <img src={avatar.src} alt={`${avatar.label} avatar`} />
                          <span>{avatar.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="account-card__actions">
                      <button type="button" onClick={cancelAvatarEdit}>Cancel</button>
                      <button type="button" className="is-primary" onClick={handleProfileSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save icon'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="account-card__value">Current icon selected for this account.</p>
                )}
              </div>

              <div className="account-card">
                <div className="account-card__topline">
                  <div>
                    <p className="account-card__label">Change name</p>
                    <h3>Display name</h3>
                  </div>
                  <button type="button" onClick={() => setEditingName((current) => !current)}>
                    {editingName ? 'Hide form' : 'Edit'}
                  </button>
                </div>

                {editingName ? (
                  <>
                    <label className="account-card__field">
                      <span>Name</span>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                        placeholder="Enter a display name"
                      />
                    </label>
                    <div className="account-card__actions">
                      <button type="button" onClick={cancelNameEdit}>Cancel</button>
                      <button type="button" className="is-primary" onClick={handleProfileSave} disabled={saving || !profileName.trim()}>
                        {saving ? 'Saving...' : 'Save name'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="account-card__value">{previewName}</p>
                )}
              </div>
            </section>

            <section className={`account-modal__section ${activeSection === 'security' ? 'is-visible' : ''}`}>
              <div className="account-card account-card--hero">
                <div>
                  <p className="account-card__label">Security controls</p>
                  <h3>Keep this account current</h3>
                </div>
                <p className="account-card__hint">Email and password updates both require your current password so Firebase can confirm it is really you.</p>
              </div>

              <div className="account-card">
                <div className="account-card__topline">
                  <div>
                    <p className="account-card__label">Change email</p>
                    <h3>Account email</h3>
                  </div>
                  <button type="button" onClick={() => setEditingEmail((current) => !current)}>
                    {editingEmail ? 'Hide form' : 'Edit'}
                  </button>
                </div>

                {editingEmail ? (
                  <>
                    <label className="account-card__field">
                      <span>New email</span>
                      <input
                        type="email"
                        value={emailDraft}
                        onChange={(event) => setEmailDraft(event.target.value)}
                        placeholder="Enter a new email"
                      />
                    </label>
                    <label className="account-card__field">
                      <span>Current password</span>
                      <input
                        type="password"
                        value={emailPassword}
                        onChange={(event) => setEmailPassword(event.target.value)}
                        placeholder="Confirm your current password"
                      />
                    </label>
                    <div className="account-card__actions">
                      <button type="button" onClick={cancelEmailEdit}>Cancel</button>
                      <button
                        type="button"
                        className="is-primary"
                        onClick={handleEmailSave}
                        disabled={saving || !emailDraft.trim() || !emailPassword.trim()}
                      >
                        {saving ? 'Saving...' : 'Save email'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="account-card__value">{user.email}</p>
                )}
              </div>

              <div className="account-card">
                <div className="account-card__topline">
                  <div>
                    <p className="account-card__label">Change password</p>
                    <h3>Password reset inside the app</h3>
                  </div>
                  <button type="button" onClick={() => setEditingPassword((current) => !current)}>
                    {editingPassword ? 'Hide form' : 'Edit'}
                  </button>
                </div>

                {editingPassword ? (
                  <>
                    <label className="account-card__field">
                      <span>Current password</span>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        placeholder="Enter your current password"
                      />
                    </label>
                    <label className="account-card__field">
                      <span>New password</span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="Create a new password"
                      />
                    </label>
                    <label className="account-card__field">
                      <span>Confirm new password</span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Re-enter the new password"
                      />
                    </label>
                    {confirmPassword && newPassword !== confirmPassword ? (
                      <p className="account-card__error">New password and confirmation have to match.</p>
                    ) : null}
                    <div className="account-card__actions">
                      <button type="button" onClick={cancelPasswordEdit}>Cancel</button>
                      <button
                        type="button"
                        className="is-primary"
                        onClick={handlePasswordSave}
                        disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword}
                      >
                        {saving ? 'Saving...' : 'Save password'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="account-card__value">Your password can be changed here after confirming the current one.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettingsModal
