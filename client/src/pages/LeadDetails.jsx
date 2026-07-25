import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Card, { CardBody, CardHeader } from "../components/Card";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { leadsApi } from "../services/api";
import "../styles/pages/lead-details.css";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await leadsApi.getById(id);
      setLead(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        <p>Loading lead details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="details-container">
        <Alert type="danger" message={error || "Lead not found"} />
        <Link to="/leads">
          <Button variant="secondary">← Back to Leads</Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await leadsApi.updateStatus(id, newStatus);
      setLead({ ...lead, status: newStatus });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "New") return "Contacted";
    if (currentStatus === "Contacted") return "Closed";
    return null;
  };

  const nextStatus = getNextStatus(lead.status);

  return (
    <div className="details-container">
      <div className="details-header">
        <div>
          <h1>{lead.name}</h1>
          <p className="breadcrumb">
            <Link to="/admin/dashboard">Leads</Link> / {lead.name}
          </p>
        </div>
        <div className="details-actions">
          {nextStatus && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange(nextStatus)}
            >
              Move to {nextStatus}
            </Button>
          )}
          <Link to="/admin/dashboard">
            <Button variant="secondary">Back to List</Button>
          </Link>
        </div>
      </div>

      {error && <Alert type="danger" message={error} />}

      <div className="details-grid">
        <Card>
          <CardHeader>Contact Information</CardHeader>
          <CardBody>
            <div className="detail-item">
              <label>Email</label>
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
            </div>
          </CardBody>
        </Card>

        {/* Lead Information */}
        <Card>
          <CardHeader>Lead Information</CardHeader>
          <CardBody>
            <div className="detail-item">
              <label>Status</label>
              <span
                className={`status-badge status-${lead.status.toLowerCase()}`}
              >
                {lead.status}
              </span>
            </div>
            <div className="detail-item">
              <label>Budget</label>
              <p>{lead.budget}</p>
            </div>
            <div className="detail-item">
              <label>Created</label>
              <p>{new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
          </CardBody>
        </Card>

        {/* Message */}
        {lead.message && (
          <Card className="full-width">
            <CardHeader>Message</CardHeader>
            <CardBody>
              <p className="notes-content">{lead.message}</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeadDetails;
