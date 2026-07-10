import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Trophy, Plus, Edit3, Trash2, Save, X, Users, Clock } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'coding', rules: '',
    reward: '', penalty: '', bonus: '', difficulty: 'medium',
    maxParticipants: 50, startDate: '', endDate: '', status: 'upcoming',
    tags: '',
  });

  useEffect(() => { fetchChallenges(); }, []);

  const fetchChallenges = async () => {
    try {
      const response = await adminService.getChallenges();
      setChallenges(response.data.data.challenges);
    } catch (error) { toast.error('Failed to load challenges'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', description: '', category: 'coding', rules: '', reward: '', penalty: '', bonus: '', difficulty: 'medium', maxParticipants: 50, startDate: '', endDate: '', status: 'upcoming', tags: '' });
    setModalOpen(true);
  };

  const openEdit = (challenge) => {
    setEditing(challenge);
    setFormData({
      title: challenge.title, description: challenge.description, category: challenge.category,
      rules: challenge.rules, reward: challenge.reward, penalty: challenge.penalty || '',
      bonus: challenge.bonus || '', difficulty: challenge.difficulty,
      maxParticipants: challenge.maxParticipants,
      startDate: challenge.startDate?.split('T')[0] || '',
      endDate: challenge.endDate?.split('T')[0] || '',
      status: challenge.status, tags: challenge.tags?.join(', ') || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) { toast.error('Title and description required'); return; }
    setSaving(true);
    try {
      const payload = { ...formData, tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [], maxParticipants: parseInt(formData.maxParticipants) };
      if (editing) {
        await adminService.updateChallenge(editing._id, payload);
        toast.success('Challenge updated');
      } else {
        await adminService.createChallenge(payload);
        toast.success('Challenge created');
      }
      setModalOpen(false);
      fetchChallenges();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this challenge?')) return;
    try { await adminService.deleteChallenge(id); toast.success('Deleted'); fetchChallenges(); }
    catch (error) { toast.error('Failed'); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#060a13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors text-sm";
  const selectClass = "w-full px-4 py-2.5 bg-[#060a13] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors text-sm";

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Challenge Management</h1>
          <p className="text-gray-400 text-sm mt-1">{challenges.length} challenges</p>
        </motion.div>
        <button onClick={openCreate} className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Challenge
        </button>
      </div>

      <div className="grid gap-3">
        {challenges.map((ch, i) => (
          <motion.div key={ch._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="bg-[#0a0f1a] border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded capitalize">{ch.difficulty}</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded capitalize">{ch.status}</span>
                  <span className="text-xs text-gray-500 capitalize">{ch.category}</span>
                </div>
                <h3 className="text-white font-bold">{ch.title}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{ch.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ch.participantCount || 0}/{ch.maxParticipants}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ch.startDate).toLocaleDateString()} - {new Date(ch.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => openEdit(ch)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(ch._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Challenge' : 'Create Challenge'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className={selectClass}>
                <option value="coding">Coding</option>
                <option value="design">Design</option>
                <option value="reading">Reading</option>
                <option value="fitness">Fitness</option>
                <option value="business">Business</option>
                <option value="writing">Writing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
              <select value={formData.difficulty} onChange={(e) => setFormData(p => ({ ...p, difficulty: e.target.value }))} className={selectClass}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))} className={selectClass}>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Participants</label>
              <input type="number" value={formData.maxParticipants} onChange={(e) => setFormData(p => ({ ...p, maxParticipants: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData(p => ({ ...p, startDate: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData(p => ({ ...p, endDate: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Rules</label>
            <textarea value={formData.rules} onChange={(e) => setFormData(p => ({ ...p, rules: e.target.value }))} rows={3} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Reward</label>
              <input type="text" value={formData.reward} onChange={(e) => setFormData(p => ({ ...p, reward: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Penalty</label>
              <input type="text" value={formData.penalty} onChange={(e) => setFormData(p => ({ ...p, penalty: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Challenge'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminChallengesPage;