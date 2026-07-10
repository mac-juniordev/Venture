import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Award, Plus, Edit3, Trash2, Save } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminAchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', icon: 'star', category: 'streak',
    tier: 'bronze', requirementType: 'streak_days', requirementValue: 1,
    xpReward: 50, isActive: true, isHidden: false,
  });

  useEffect(() => { fetchAchievements(); }, []);

  const fetchAchievements = async () => {
    try {
      const response = await adminService.getAchievements();
      setAchievements(response.data.data.achievements);
    } catch (error) { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', description: '', icon: 'star', category: 'streak', tier: 'bronze', requirementType: 'streak_days', requirementValue: 1, xpReward: 50, isActive: true, isHidden: false });
    setModalOpen(true);
  };

  const openEdit = (ach) => {
    setEditing(ach);
    setFormData({
      title: ach.title, description: ach.description, icon: ach.icon, category: ach.category,
      tier: ach.tier, requirementType: ach.requirement?.type || 'streak_days',
      requirementValue: ach.requirement?.value || 1, xpReward: ach.xpReward,
      isActive: ach.isActive, isHidden: ach.isHidden,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        requirement: { type: formData.requirementType, value: parseInt(formData.requirementValue) },
      };
      if (editing) {
        await adminService.updateAchievement(editing._id, payload);
        toast.success('Updated');
      } else {
        await adminService.createAchievement(payload);
        toast.success('Created');
      }
      setModalOpen(false);
      fetchAchievements();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await adminService.deleteAchievement(id); toast.success('Deleted'); fetchAchievements(); }
    catch { toast.error('Failed'); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#060a13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors text-sm";
  const selectClass = "w-full px-4 py-2.5 bg-[#060a13] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors text-sm";

  const tierColors = { bronze: 'text-amber-400', silver: 'text-gray-300', gold: 'text-yellow-400', platinum: 'text-cyan-400', legendary: 'text-purple-400' };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Achievement Management</h1>
          <p className="text-gray-400 text-sm mt-1">{achievements.length} achievements</p>
        </motion.div>
        <button onClick={openCreate} className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Achievement
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((ach, i) => (
          <motion.div key={ach._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="bg-[#0a0f1a] border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold capitalize ${tierColors[ach.tier]}`}>{ach.tier}</span>
                  <span className="text-xs text-gray-500 capitalize">{ach.category}</span>
                  <span className="text-xs text-gray-600">{ach.xpReward} XP</span>
                  {!ach.isActive && <span className="text-xs text-red-400">Inactive</span>}
                </div>
                <h3 className="text-white font-bold text-sm">{ach.title}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{ach.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(ach)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(ach._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Achievement' : 'Create Achievement'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Icon</label>
              <select value={formData.icon} onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))} className={selectClass}>
                {['flame','star','trophy','crown','zap','target','shield','gem','rocket','heart','bolt','moon','sun','compass','diamond','fire','leaf','wave','sword'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} className={inputClass} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className={selectClass}>
                {['streak','checkin','challenge','social','special','milestone'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tier</label>
              <select value={formData.tier} onChange={(e) => setFormData(p => ({ ...p, tier: e.target.value }))} className={selectClass}>
                {['bronze','silver','gold','platinum','legendary'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">XP Reward</label>
              <input type="number" value={formData.xpReward} onChange={(e) => setFormData(p => ({ ...p, xpReward: parseInt(e.target.value) }))} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Requirement Type</label>
              <select value={formData.requirementType} onChange={(e) => setFormData(p => ({ ...p, requirementType: e.target.value }))} className={selectClass}>
                {['streak_days','total_checkins','challenges_completed','challenges_won','profile_complete'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Requirement Value</label>
              <input type="number" value={formData.requirementValue} onChange={(e) => setFormData(p => ({ ...p, requirementValue: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))} className={`px-4 py-2 rounded-lg text-sm border ${formData.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
              {formData.isActive ? 'Active' : 'Inactive'}
            </button>
            <button onClick={() => setFormData(p => ({ ...p, isHidden: !p.isHidden }))} className={`px-4 py-2 rounded-lg text-sm border ${formData.isHidden ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
              {formData.isHidden ? 'Hidden' : 'Visible'}
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAchievementsPage;