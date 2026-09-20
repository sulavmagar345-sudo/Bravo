import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import FileUpload from '../components/FileUpload';
import ConfirmModal from '../components/ConfirmModal';
import { fetchAllGalleryItems, uploadGalleryImage, updateGalleryItem, deleteGalleryItem, getGalleryImageUrl } from '../services/gallery';
import { GALLERY_CATEGORIES } from '../types';
import type { GalleryItem, GalleryCategory } from '../types';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('training');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      const data = await fetchAllGalleryItems();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile) return;
    setError(null);
    setUploading(true);

    try {
      await uploadGalleryImage(uploadFile, uploadCategory, uploadTitle);
      setIsUploading(false);
      setUploadFile(null);
      setUploadTitle('');
      await loadItems();
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleTogglePublish(id: string, current: boolean) {
    try {
      await updateGalleryItem(id, { published: !current });
      setItems(items.map(item => item.id === id ? { ...item, published: !current } : item));
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const item = items.find(i => i.id === deleteId);
    if (!item) return;

    try {
      await deleteGalleryItem(item.id, item.image_path);
      setDeleteId(null);
      await loadItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    }
  }

  return (
    <div>
      <PageHeader 
        title="Gallery" 
        subtitle="Manage images displayed in the public gallery. Note: Existing hardcoded images will still display alongside these."
        action={
          <button className="admin-btn admin-btn--primary" onClick={() => setIsUploading(true)}>
            + Upload Image
          </button>
        }
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {isUploading && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card__header">
            <h3 className="admin-card__title">Upload New Image</h3>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleUpload}>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label className="admin-label">Category *</label>
                  <select className="admin-select" value={uploadCategory} onChange={e => setUploadCategory(e.target.value as GalleryCategory)}>
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title / Caption (Optional)</label>
                  <input className="admin-input" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">Image File *</label>
                <FileUpload 
                  accept="image/jpeg,image/png,image/webp" 
                  onSelect={setUploadFile}
                  hint="JPG, PNG, WebP up to 10MB"
                />
                {uploadFile && <div className="admin-input-hint" style={{ marginTop: 5 }}>Selected: {uploadFile.name}</div>}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => { setIsUploading(false); setUploadFile(null); }} disabled={uploading}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={uploading || !uploadFile}>
                  {uploading ? 'Uploading...' : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /> Loading gallery...</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">No images uploaded via admin panel yet.</div>
      ) : (
        <div className="admin-gallery-grid">
          {items.map(item => (
            <div key={item.id} className="admin-gallery-item" style={{ opacity: item.published ? 1 : 0.6 }}>
              <img 
                src={getGalleryImageUrl(item.image_path)} 
                alt={item.title || ''} 
                className="admin-gallery-item__img" 
              />
              <div className="admin-gallery-item__overlay">
                <button 
                  className="admin-btn admin-btn--sm admin-btn--secondary" 
                  style={{ background: '#fff' }}
                  onClick={() => handleTogglePublish(item.id, item.published)}
                  title={item.published ? 'Hide from public' : 'Show to public'}
                >
                  {item.published ? 'Hide' : 'Show'}
                </button>
                <button 
                  className="admin-btn admin-btn--sm admin-btn--danger"
                  onClick={() => setDeleteId(item.id)}
                >
                  Delete
                </button>
              </div>
              <div className="admin-gallery-item__footer">
                <span className="admin-gallery-item__caption">
                  {item.title || <i>No title</i>}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Image"
        message="Are you sure you want to delete this image from the gallery? This cannot be undone."
        confirmLabel="Delete Image"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Gallery;
