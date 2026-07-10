import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, Search, Eye, Pause, Play, Trash2, Shield } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminBuildersPage = () => {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [builderDetail, setBuilderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchBuilders();
  }, [page, search]);

  const fetchBuilders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBuilders({ page, search, limit: 20 });
      setBuilders(response.data.data.builders);
      setTotalPages(response.data.data.pages);
      setTotal(response.data.data.total);
    } catch (error) {
      toast.error('Failed to load builders');
    } finally {
      setLoading(false);
    }
  };

  const viewBuilder = async (builder) => {
    setSelectedBuilder(builder);
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const response = await adminService.getBuilderDetail(builder._id);
      setBuilderDetail(response.data.data);
    } catch (error) {
      toast.error('Failed to load builder details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSuspend = async (id) => {
    try {
      await adminService.suspendBuilder(id);
      toast.success('Builder suspended');
      fetchBuilders();
      if (detailModalOpen) {
        const response = await adminService.getBuilderDetail(id);
        setBuilderDetail(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const handleRestore = async (id) => {
    try {
      await adminService.restoreBuilder(id);
      toast.success('Builder restored');
      fetchBuilders();
      if (detailModalOpen) {
        const response = await adminService.getBuilderDetail(id);
        setBuilderDetail(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this builder? This cannot be undone.')) return;
    try {
      await adminService.deleteBuilder(id);
      toast.success('Builder deleted');
      setDetailModalOpen(false);
      fetchBuilders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      suspended: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      archived: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    };
    return badges[status] || badges.active;
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#060a13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors text-sm";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Builder Management</h1>
        <p className="text-gray-400 text-sm mt-1">{total} builders in the ecosystem</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search builders by email..."
          className="w-full pl-11 pr-4 py-2.5 bg-[#0a0f1a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
        />
      </div>

      {/* Builders Table */}
      <div className="bg-[#0a0f1a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Builder</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Spinner size="md" />
                  </td>
                </tr>
              ) : builders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No builders found</td>
                </tr>
              ) : (
                builders.map((builder) => (
                  <tr key={builder._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" src={builder.profile?.avatar ? `http://localhost:5000${builder.profile.avatar}` : null} alt={builder.email} />
                        <div>
                          <p className="text-sm font-medium text-white">{builder.profile?.displayName || builder.email.split('@')[0]}</p>
                          <p className="text-xs text-gray-500">{builder.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(builder.accountStatus)}`}>
                        {builder.accountStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400 capitalize">{builder.role}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{new Date(builder.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => viewBuilder(builder)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {builder.accountStatus === 'active' ? (
                          <button onClick={() => handleSuspend(builder._id)} className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors" title="Suspend">
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : builder.accountStatus === 'suspended' ? (
                          <button onClick={() => handleRestore(builder._id)} className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Restore">
                            <Play className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button onClick={() => handleDelete(builder._id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-800">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-gray-400 hover:text-white disabled:opacity-30">Previous</button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-gray-400 hover:text-white disabled:opacity-30">Next</button>
          </div>
        )}
      </div>

      {/* Builder Detail Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Builder Details" size="lg">
        {detailLoading ? (
          <div className="flex justify-center py-8"><Spinner size="md" /></div>
        ) : builderDetail ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar size="lg" src={builderDetail.profile?.avatar ? `http://localhost:5000${builderDetail.profile.avatar}` : null} alt={builderDetail.builder?.email} />
              <div>
                <h3 className="text-lg font-bold text-white">{builderDetail.profile?.displayName || builderDetail.builder?.email?.split('@')[0]}</h3>
                <p className="text-gray-400">{builderDetail.builder?.email}</p>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border mt-1 inline-block ${getStatusBadge(builderDetail.builder?.accountStatus)}`}>
                  {builderDetail.builder?.accountStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#060a13] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{builderDetail.stats?.totalCheckins || 0}</div>
                <div className="text-xs text-gray-500">Check-ins</div>
              </div>
              <div className="bg-[#060a13] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{builderDetail.stats?.challengesJoined || 0}</div>
                <div className="text-xs text-gray-500">Challenges</div>
              </div>
              <div className="bg-[#060a13] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{builderDetail.profile?.longestStreak || 0}</div>
                <div className="text-xs text-gray-500">Best Streak</div>
              </div>
            </div>

            {builderDetail.profile?.bio && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Bio</p>
                <p className="text-sm text-gray-300">{builderDetail.profile.bio}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-800">
              {builderDetail.builder?.accountStatus === 'active' ? (
                <button onClick={() => handleSuspend(builderDetail.builder._id)} className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-sm hover:bg-amber-500/20">Suspend</button>
              ) : builderDetail.builder?.accountStatus === 'suspended' ? (
                <button onClick={() => handleRestore(builderDetail.builder._id)} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm hover:bg-emerald-500/20">Restore</button>
              ) : null}
              <button onClick={() => handleDelete(builderDetail.builder._id)} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/20">Delete</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default AdminBuildersPage;