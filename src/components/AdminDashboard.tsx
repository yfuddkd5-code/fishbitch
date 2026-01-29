import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import PixelAxolotl from './PixelAxolotl';
import PixelIcon from './PixelIcon';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type WhitelistEntry = Database['public']['Tables']['whitelist_entries']['Row'];

const AdminDashboard: React.FC = () => {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<WhitelistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, statusFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      navigate('/admin');
    }
  };

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whitelist_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error 😢",
        description: "Failed to load entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.wallet_address.toLowerCase().includes(term) ||
        e.twitter_handle.toLowerCase().includes(term) ||
        e.gm_gn.toLowerCase().includes(term)
      );
    }

    setFilteredEntries(filtered);
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('whitelist_entries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => 
        prev.map(e => e.id === id ? { ...e, status } : e)
      );

      toast({
        title: status === 'approved' ? "Approved! ✅" : "Rejected ❌",
        description: `Entry has been ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error 😢",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const approvedEntries = entries.filter(e => e.status === 'approved');
    
    if (approvedEntries.length === 0) {
      toast({
        title: "No data 📭",
        description: "No approved entries to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Wallet Address', 'Twitter Handle', 'GM/GN', 'Reason', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...approvedEntries.map(e => [
        `"${e.wallet_address}"`,
        `"${e.twitter_handle}"`,
        `"${e.gm_gn}"`,
        `"${e.reason.replace(/"/g, '""')}"`,
        e.status,
        new Date(e.created_at).toISOString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poki-whitelist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported! 📁",
      description: `${approvedEntries.length} entries exported`,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "pixel-badge";
    switch (status) {
      case 'pending':
        return `${baseClass} pixel-badge-pending`;
      case 'approved':
        return `${baseClass} pixel-badge-approved`;
      case 'rejected':
        return `${baseClass} pixel-badge-rejected`;
      default:
        return baseClass;
    }
  };

  const stats = {
    total: entries.length,
    pending: entries.filter(e => e.status === 'pending').length,
    approved: entries.filter(e => e.status === 'approved').length,
    rejected: entries.filter(e => e.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <PixelAxolotl size={60} variant="cool" />
          <div>
            <h1 className="font-pixel text-lg md:text-xl text-primary text-shadow-pixel">
              ADMIN PANEL
            </h1>
            <p className="font-pixel-body text-muted-foreground">
              Manage your whitelist entries
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={exportToCSV} className="pixel-button pixel-button-success text-xs">
            EXPORT CSV
          </button>
          <button onClick={handleLogout} className="pixel-button pixel-button-secondary text-xs">
            LOGOUT
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="pixel-card text-center">
          <p className="font-pixel text-2xl text-foreground">{stats.total}</p>
          <p className="font-pixel-body text-muted-foreground">Total</p>
        </div>
        <div className="pixel-card text-center">
          <p className="font-pixel text-2xl text-warning">{stats.pending}</p>
          <p className="font-pixel-body text-muted-foreground">Pending</p>
        </div>
        <div className="pixel-card text-center">
          <p className="font-pixel text-2xl text-success">{stats.approved}</p>
          <p className="font-pixel-body text-muted-foreground">Approved</p>
        </div>
        <div className="pixel-card text-center">
          <p className="font-pixel text-2xl text-destructive">{stats.rejected}</p>
          <p className="font-pixel-body text-muted-foreground">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="pixel-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <PixelIcon type="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by wallet, twitter, or greeting..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pixel-input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`pixel-button text-xs ${
                  statusFilter === status 
                    ? '' 
                    : 'pixel-button-secondary'
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="pixel-card text-center py-12">
          <PixelAxolotl size={80} className="mx-auto pixel-bounce mb-4" />
          <p className="font-pixel text-sm">Loading entries...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="pixel-card text-center py-12">
          <PixelAxolotl size={80} variant="happy" className="mx-auto mb-4" />
          <p className="font-pixel text-sm text-muted-foreground">
            No entries found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="pixel-table">
            <thead>
              <tr>
                <th>GM/GN</th>
                <th>Wallet</th>
                <th>Twitter</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="font-pixel-body">{entry.gm_gn}</td>
                  <td className="font-pixel-body">
                    <span className="font-mono text-xs">
                      {entry.wallet_address.slice(0, 6)}...{entry.wallet_address.slice(-4)}
                    </span>
                  </td>
                  <td className="font-pixel-body">{entry.twitter_handle}</td>
                  <td className="font-pixel-body max-w-xs truncate" title={entry.reason}>
                    {entry.reason}
                  </td>
                  <td>
                    <span className={getStatusBadge(entry.status)}>
                      {entry.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {entry.status !== 'approved' && (
                        <button
                          onClick={() => updateStatus(entry.id, 'approved')}
                          className="pixel-button pixel-button-success text-xs py-1 px-2"
                          title="Approve"
                        >
                          <PixelIcon type="check" size={14} />
                        </button>
                      )}
                      {entry.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(entry.id, 'rejected')}
                          className="pixel-button pixel-button-destructive text-xs py-1 px-2"
                          title="Reject"
                        >
                          <PixelIcon type="x" size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Back link */}
      <div className="mt-8 text-center">
        <a 
          href="/" 
          className="font-pixel-body text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← View public whitelist form
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
