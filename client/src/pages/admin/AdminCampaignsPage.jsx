import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Calendar, Plus, Edit3, Trash2, Save, Trophy } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', motto: '', description: '', theme: 'default',
    startDate: '', endDate: '', rewards: '', isActive: false,
  });

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await adminService.getCampaigns();
      setCampaigns(response.data.data.campaigns);
    } catch (error) { toast.error('Failed to load campaigns'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', motto: '', description: '', theme: 'default', startDate: '', endDate: '', rewards: '', isActive: false });
    setModalOpen(true);
  };

  const openEdit = (campaign) => {
    setEditing(campaign);
    setFormData({
      title: campaign.title, motto: campaign.motto || '', description: campaign.description || '',
      theme: campaign.theme, startDate: campaign.startDate?.split('T')[0] || '',
      endDate: campaign.endDate?.split('T')[0] || '', rewards: campaign.rewards || '',
      isActive: campaign.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminService.updateCampaign(editing._id, formData);
        toast.success('Campaign updated');
      } else {
        await adminService.createCampaign(formData);
        toast.success('Campaign created');
      }
      setModalOpen(false);
      fetchCampaigns();
    } catch (error) { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await adminService.deleteCampaign(id); toast.success('Deleted'); fetchCampaigns(); }
    catch { toast.error('Failed'); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-[#060a13] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors text-sm";

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{campaigns.length} campaigns</p>
        </motion.div>
        <button onClick={openCreate} className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="grid gap-3">
        {campaigns.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${c.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {c.motto && <span className="text-xs text-gray-500 italic">"{c.motto}"</span>}
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold">{c.title}</h3>
                {c.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{c.description}</p>}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</span>
                  <span>Theme: {c.theme}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Campaign' : 'Create Campaign'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motto</label>
            <input type="text" value={formData.motto} onChange={(e) => setFormData(p => ({ ...p, motto: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData(p => ({ ...p, startDate: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData(p => ({ ...p, endDate: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
              <input type="text" value={formData.theme} onChange={(e) => setFormData(p => ({ ...p, theme: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rewards</label>
              <input type="text" value={formData.rewards} onChange={(e) => setFormData(p => ({ ...p, rewards: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <button onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
            className={`px-4 py-2 rounded-lg text-sm border ${formData.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}
          >
            {formData.isActive ? 'Active' : 'Inactive'}
          </button>
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

export default AdminCampaignsPage;