import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import FileUpload from '../components/FileUpload';
import { fetchAllBanners, createBanner, updateBanner, deleteBanner, replaceBannerImage, getBannerImageUrl } from '../services/banners';
import { getBannerComputedState } from '../types';
import type { Banner, BannerStatus, DisplayLocation } from '../types';

const Banners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [displayLocation, setDisplayLocation] = useState<DisplayLocation>('homepage');
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [status, setStatus] = useState<BannerStatus>('draft');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    try {
      setLoading(true);
      const data = await fetchAllBanners();
      setBanners(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  }

  function handleAddNew() {
    setEditId(null);
    setTitle('');
    setDescription('');
    setButtonText('');
    setButtonUrl('');
    setDisplayLocation('homepage');
    
    // Default startsAt to now, properly formatted for datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setStartsAt(now.toISOString().slice(0, 16));
    
    setExpiresAt('');
    setStatus('draft');
    setImageFile(null);
    setIsEditing(true);
  }

  function handleEdit(banner: Banner) {
    setEditId(banner.id);
    setTitle(banner.title);
    setDescription(banner.description || '');
    setButtonText(banner.button_text || '');
    setButtonUrl(banner.button_url || '');
    setDisplayLocation(banner.display_location);
    
    // Format for datetime-local input (YYYY-MM-DDThh:mm)
    const start = new Date(banner.starts_at);
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    setStartsAt(start.toISOString().slice(0, 16));
    
    if (banner.expires_at) {
      const end = new Date(banner.expires_at);
      end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
      setExpiresAt(end.toISOString().slice(0, 16));
    } else {
      setExpiresAt('');
    }
    
    setStatus(banner.status);
    setImageFile(null);
    setIsEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    
    try {
      const startIso = new Date(startsAt).toISOString();
      const endIso = expiresAt ? new Date(expiresAt).toISOString() : null;
      
      if (editId) {
        // Update existing
        const banner = banners.find(b => b.id === editId)!;
        let image_path = banner.image_path;
        
        if (imageFile) {
          image_path = await replaceBannerImage(editId, imageFile, banner.image_path);
        }
        
        await updateBanner(editId, {
          title,
          description: description || null,
          button_text: buttonText || null,
          button_url: buttonUrl || null,
          display_location: displayLocation,
          starts_at: startIso,
          expires_at: endIso,
          status
        });
      } else {
        // Create new
        if (!imageFile) throw new Error('An image is required for new banners.');
        await createBanner({
          title,
          description: description || null,
          button_text: buttonText || null,
          button_url: buttonUrl || null,
          display_location: displayLocation,
          starts_at: startIso,
          expires_at: endIso,
          status
        }, imageFile);
      }
      
      setIsEditing(false);
      await loadBanners();
    } catch (err: any) {
      setError(err.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const banner = banners.find(b => b.id === deleteId);
    if (!banner) return;
    
    try {
      await deleteBanner(banner.id, banner.image_path);
      setDeleteId(null);
      await loadBanners();
    } catch (err: any) {
      setError(err.message || 'Failed to delete banner');
    }
  }

  return (
    <div>
      <PageHeader 
        title="Banners" 
        subtitle="Manage promotional banners displayed at the top of the website."
        action={
          <button className="admin-btn admin-btn--primary" onClick={handleAddNew}>
            + New Banner
          </button>
        }
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {isEditing ? (
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">{editId ? 'Edit Banner' : 'Create Banner'}</h3>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label className="admin-label">Title *</label>
                  <input className="admin-input" required value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Display Location</label>
                  <select className="admin-select" value={displayLocation} onChange={e => setDisplayLocation(e.target.value as any)}>
                    <option value="homepage">Homepage Only</option>
                    <option value="all">All Pages</option>
                  </select>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">Description (Optional)</label>
                <textarea className="admin-textarea" value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label className="admin-label">Button Text (Optional)</label>
                  <input className="admin-input" placeholder="e.g. Learn More" value={buttonText} onChange={e => setButtonText(e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Button Link URL (Optional)</label>
                  <input className="admin-input" placeholder="e.g. /programs/barista" value={buttonUrl} onChange={e => setButtonUrl(e.target.value)} />
                </div>
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label className="admin-label">Start Time *</label>
                  <input className="admin-input" type="datetime-local" required value={startsAt} onChange={e => setStartsAt(e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Expiry Time (Optional)</label>
                  <input className="admin-input" type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
                  <span className="admin-input-hint">Leave blank to show indefinitely.</span>
                </div>
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label className="admin-label">Status</label>
                  <select className="admin-select" value={status} onChange={e => setStatus(e.target.value as any)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Image {editId ? '(Optional — upload to replace)' : '*'}</label>
                  {editId && !imageFile && (
                    <div className="admin-preview-wrap" style={{ marginTop: 0, marginBottom: 10 }}>
                      <img 
                        src={getBannerImageUrl(banners.find(b => b.id === editId)!.image_path)} 
                        className="admin-preview-img" 
                        style={{ height: 60, width: '100%', objectFit: 'cover' }}
                        alt="Current" 
                      />
                    </div>
                  )}
                  <FileUpload 
                    accept="image/jpeg,image/png,image/webp" 
                    onSelect={setImageFile}
                  />
                  {imageFile && <div className="admin-input-hint" style={{ marginTop: 5 }}>Selected: {imageFile.name}</div>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setIsEditing(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Schedule</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
                ) : banners.length === 0 ? (
                  <tr><td colSpan={5} className="admin-empty">No banners found.</td></tr>
                ) : (
                  banners.map(banner => {
                    const computedState = getBannerComputedState(banner);
                    return (
                      <tr key={banner.id}>
                        <td>
                          <img 
                            src={getBannerImageUrl(banner.image_path)} 
                            alt="" 
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{banner.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                            {banner.display_location === 'all' ? 'All Pages' : 'Homepage Only'}
                          </div>
                        </td>
                        <td><StatusBadge variant={computedState} /></td>
                        <td style={{ fontSize: '0.8rem' }}>
                          <div>{new Date(banner.starts_at).toLocaleDateString()}</div>
                          {banner.expires_at && <div style={{ color: 'var(--admin-text-muted)' }}>until {new Date(banner.expires_at).toLocaleDateString()}</div>}
                        </td>
                        <td>
                          <div className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={() => handleEdit(banner)}>Edit</button>
                            <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteId(banner.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmLabel="Delete Banner"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Banners;
