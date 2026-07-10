import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Megaphone, Plus, Edit3, Trash2, Save } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', type: 'general', isPublished: false,
  });

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await adminService.getAnnouncements();
      setAnnouncements(response.data.data.announcements);
    } catch (error) { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', content: '', type: 'general', isPublished: false });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setFormData({ title: a.title, content: a.content, type: a.type, isPublished: a.isPublished });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) { toast.error('Title and content required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminService.updateAnnouncement(editing._id, formData);
        toast.success('Updated');
      } else {
        await adminService.createAnnouncement(formData);
        toast.success('Created');
      }
      setModalOpen(false);
      fetchAnnouncements();
    } catch (error) { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await adminService.deleteAnnouncement(id); toast.success('Deleted'); fetchAnnouncements(); }
    catch { toast.error('Failed'); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-[#060a13] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors text-sm";

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{announcements.length} announcements</p>
        </motion.div>
        <button onClick={openCreate} className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((a, i) => (
          <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded capitalize">{a.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${a.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {a.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold">{a.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{a.content}</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => openEdit(a)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(a._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Announcement' : 'New Announcement'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} rows={4} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))} className={inputClass}>
                <option value="general">General</option>
                <option value="feature">Feature</option>
                <option value="event">Event</option>
                <option value="maintenance">Maintenance</option>
                <option value="important">Important</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => setFormData(p => ({ ...p, isPublished: !p.isPublished }))}
                className={`px-4 py-2.5 rounded-lg text-sm border w-full ${formData.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}
              >
                {formData.isPublished ? 'Published' : 'Draft'}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAnnouncementsPage;