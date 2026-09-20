import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchSettingsMap, updateAllSettings } from '../services/settings';
import type { SiteSettingsMap } from '../types';

const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<Partial<SiteSettingsMap>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await fetchSettingsMap();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key: keyof SiteSettingsMap, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await updateAllSettings(settings);
      setSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Site Settings" />
        <div className="admin-loading"><span className="admin-spinner" /> Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Site Settings" 
        subtitle="Manage contact information, operating hours, and social media links displayed across the website."
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {success && <div className="admin-alert admin-alert--success">Settings saved successfully.</div>}

      <form className="admin-card" onSubmit={handleSave}>
        <div className="admin-card__header">
          <h3 className="admin-card__title">Contact Information</h3>
        </div>
        <div className="admin-card__body admin-settings-grid">
          <div className="admin-field">
            <label className="admin-label">Phone Number</label>
            <input 
              className="admin-input" 
              value={settings.phone || ''} 
              onChange={e => handleChange('phone', e.target.value)} 
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">WhatsApp Number</label>
            <input 
              className="admin-input" 
              value={settings.whatsapp || ''} 
              onChange={e => handleChange('whatsapp', e.target.value)} 
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Email Address</label>
            <input 
              className="admin-input" 
              type="email"
              value={settings.email || ''} 
              onChange={e => handleChange('email', e.target.value)} 
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Physical Address</label>
            <input 
              className="admin-input" 
              value={settings.address || ''} 
              onChange={e => handleChange('address', e.target.value)} 
            />
          </div>
        </div>

        <div className="admin-card__header" style={{ borderTop: '1px solid var(--admin-border)' }}>
          <h3 className="admin-card__title">Operating Hours</h3>
        </div>
        <div className="admin-card__body admin-settings-grid">
          <div className="admin-field">
            <label className="admin-label">School Hours</label>
            <input 
              className="admin-input" 
              value={settings.hours_school || ''} 
              onChange={e => handleChange('hours_school', e.target.value)} 
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Café & Bar Hours</label>
            <input 
              className="admin-input" 
              value={settings.hours_cafe || ''} 
              onChange={e => handleChange('hours_cafe', e.target.value)} 
            />
          </div>
        </div>

        <div className="admin-card__header" style={{ borderTop: '1px solid var(--admin-border)' }}>
          <h3 className="admin-card__title">Social Links</h3>
        </div>
        <div className="admin-card__body admin-settings-grid">
          <div className="admin-field">
            <label className="admin-label">Facebook URL</label>
            <input 
              className="admin-input" 
              type="url"
              value={settings.facebook_url || ''} 
              onChange={e => handleChange('facebook_url', e.target.value)} 
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Instagram URL</label>
            <input 
              className="admin-input" 
              type="url"
              value={settings.instagram_url || ''} 
              onChange={e => handleChange('instagram_url', e.target.value)} 
            />
          </div>
        </div>

        <div className="admin-card__body" style={{ borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
