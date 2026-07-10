import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { MessageSquare, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminMotivationsPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [formData, setFormData] = useState({
    message: '', author: 'VENTURE', category: 'mindset',
    timeOfDay: 'any', priority: 1, isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const response = await adminService.getMotivations();
      setMessages(response.data.data.messages);
    } catch (error) { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingMessage(null);
    setFormData({ message: '', author: 'VENTURE', category: 'mindset', timeOfDay: 'any', priority: 1, isActive: true });
    setEditModalOpen(true);
  };

  const openEdit = (msg) => {
    setEditingMessage(msg);
    setFormData({
      message: msg.message, author: msg.author, category: msg.category,
      timeOfDay: msg.timeOfDay, priority: msg.priority, isActive: msg.isActive,
    });
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.message.trim()) { toast.error('Message is required'); return; }
    setSaving(true);
    try {
      if (editingMessage) {
        await adminService.updateMotivation(editingMessage._id, formData);
        toast.success('Message updated');
      } else {
        await adminService.createMotivation(formData);
        toast.success('Message created');
      }
      setEditModalOpen(false);
      fetchMessages();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminService.deleteMotivation(id);
      toast.success('Message deleted');
      fetchMessages();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#060a13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors text-sm";
  const selectClass = "w-full px-4 py-2.5 bg-[#060a13] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors text-sm";

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Motivation Engine</h1>
          <p className="text-gray-400 text-sm mt-1">{messages.length} messages in rotation</p>
        </motion.div>
        <button onClick={openCreate} className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Message
        </button>
      </div>

      <div className="grid gap-3">
        {messages.map((msg, i) => (
          <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="bg-[#0a0f1a] border border-gray-800 rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded capitalize">{msg.category}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-500/10 text-gray-400 rounded capitalize">{msg.timeOfDay}</span>
                <span className="text-xs text-gray-600">Priority: {msg.priority}</span>
                {!msg.isActive && <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded">Inactive</span>}
              </div>
              <p className="text-white text-sm italic">"{msg.message}"</p>
              <p className="text-gray-500 text-xs mt-1">— {msg.author}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(msg)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(msg._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={editingMessage ? 'Edit Message' : 'New Message'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
            <textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} rows={3} className={inputClass} placeholder="Write your motivation message..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
              <input type="text" value={formData.author} onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Priority (1-10)</label>
              <input type="number" value={formData.priority} onChange={(e) => setFormData(p => ({ ...p, priority: parseInt(e.target.value) }))} min={1} max={10} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className={selectClass}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="grind">Grind</option>
                <option value="mindset">Mindset</option>
                <option value="weekend">Weekend</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Time of Day</label>
              <select value={formData.timeOfDay} onChange={(e) => setFormData(p => ({ ...p, timeOfDay: e.target.value }))} className={selectClass}>
                <option value="any">Any Time</option>
                <option value="morning">Morning (5-12)</option>
                <option value="afternoon">Afternoon (12-17)</option>
                <option value="evening">Evening (17-21)</option>
                <option value="night">Night (21-5)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${formData.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}
            >
              {formData.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Message'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMotivationsPage;