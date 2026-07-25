import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card, { CardBody } from "../components/Card";
import Alert from "../components/Alert";
import Input from "../components/Input";
import Button from "../components/Button";
import { leadsApi } from "../services/api";
import "../styles/pages/dashboard.css";

const statItems = [
  {
    key: "totalLeads",
    label: "Total Leads",
    mark: "TL",
    detail: "All customer inquiries",
  },
  {
    key: "newLeads",
    label: "New Leads",
    mark: "NL",
    detail: "Awaiting first follow-up",
  },
  {
    key: "contactedLeads",
    label: "Contacted",
    mark: "CL",
    detail: "Active conversations",
  },
  {
    key: "closedLeads",
    label: "Closed",
    mark: "✓",
    detail: "Successfully converted",
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchData = async (
    nextSearch = search,
    nextStatus = status,
    nextPage = page,
  ) => {
    try {
      setLoading(true);
      setError("");
      const [statsResponse, leadsResponse] = await Promise.all([
        leadsApi.getStats(),
        leadsApi.getAll(nextPage, 10, nextSearch, nextStatus),
      ]);
      setStats(statsResponse.data.data);
      setLeads(leadsResponse.data.data.leads || []);
      setTotalPages(leadsResponse.data.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const updateFilter = (key, value) => {
    const nextSearch = key === "search" ? value : search;
    const nextStatus = key === "status" ? value : status;
    if (key === "search") setSearch(value);
    else setStatus(value);
    setPage(1);
    fetchData(nextSearch, nextStatus, 1);
  };
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      setUpdatingStatusId(leadId);
      await leadsApi.updateStatus(leadId, newStatus);
      setSuccess("Lead status updated successfully");
      fetchData();
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update lead status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  if (loading && !stats)
    return (
      <div className="dashboard-loading">
        <span className="spinner" /> Loading dashboard...
      </div>
    );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-kicker">LEAD MANAGEMENT</span>
            <h1>Welcome back, Admin</h1>
            <p>Track every conversation and keep your pipeline moving.</p>
          </div>
          <Link to="/" className="btn btn-secondary">
            View landing page
          </Link>
        </header>
        {error && (
          <Alert type="danger" message={error} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}
        <section className="stats-grid">
          {statItems.map(({ key, label, mark, detail }) => (
            <Card className={`stat-card stat-card-${key}`} key={key}>
              <CardBody>
                <div className="stat-copy">
                  <span>{label}</span>
                  <strong>{stats?.[key] || 0}</strong>
                  <small>{detail}</small>
                </div>
                <i className={`stat-mark stat-${key}`}>{mark}</i>
              </CardBody>
            </Card>
          ))}
        </section>
        <Card className="leads-card">
          <CardBody>
            <div className="leads-card-header">
              <div>
                <h2>Lead pipeline</h2>
                <p>
                  {leads.length} lead{leads.length === 1 ? "" : "s"} on this
                  page
                </p>
              </div>
            </div>
            <div className="dashboard-filters">
              <Input
                label="Search leads"
                placeholder="Name or email"
                value={search}
                onChange={(event) => updateFilter("search", event.target.value)}
              />
              <div className="input-group">
                <label className="input-label" htmlFor="lead-status-filter">
                  Status
                </label>
                <select
                  id="lead-status-filter"
                  className="status-select"
                  value={status}
                  onChange={(event) =>
                    updateFilter("status", event.target.value)
                  }
                >
                  <option value="">All statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Budget</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length ? (
                    leads.map((lead) => (
                      <tr key={lead._id}>
                        <td>
                          <Link to={`/admin/leads/${lead._id}`}>
                            <strong>{lead.name}</strong>
                            <small>{lead.email}</small>
                          </Link>
                        </td>
                        <td>{lead.budget || "—"}</td>
                        <td className="lead-message">{lead.message || "—"}</td>
                        <td>
                          <span
                            className={`badge badge-${lead.status.toLowerCase()}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            value={lead.status}
                            onChange={(event) =>
                              handleStatusChange(lead._id, event.target.value)
                            }
                            className="status-select"
                            disabled={updatingStatusId === lead._id}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="dashboard-empty">
                        No leads match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
        <div className="dashboard-pagination">
          <span>
            Page {page} of {totalPages}
          </span>
          <div>
            <Button
              variant="secondary"
              disabled={page === 1 || loading}
              onClick={() => {
                const next = page - 1;
                setPage(next);
                fetchData(search, status, next);
              }}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page === totalPages || loading}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchData(search, status, next);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
