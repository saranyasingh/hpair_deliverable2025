import React, { useState, useEffect } from 'react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import { submitForm, getFormSubmissions, getSubmissionCount } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config"; 


const MultiStepForm = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, userId } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
  };

  // Load user's submissions
  useEffect(() => {
    loadSubmissions();
  }, [userId]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const [submissionsResult, countResult] = await Promise.all([
        getFormSubmissions(),
        getSubmissionCount()
      ]);

      if (submissionsResult.success) {
        // Show only current user's submissions
        const userSubmissions = submissionsResult.data.filter(
          submission => submission.userId === userId
        );
        setSubmissions(userSubmissions);
      } else {
        setError(submissionsResult.message);
      }

      if (countResult.success) {
        setSubmissionCount(countResult.count);
      }
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // TODO: Add validation before submitting
      let pdfFileName = null;
      let pdfFileUrl = null;

      if (values.pdfFile) {
        console.log("📂 Uploading PDF:", values.pdfFile.name);
        const file = values.pdfFile;
        const storageRef = ref(storage, `pdfUploads/${userId}/${Date.now()}-${file.name}`);
      
        await uploadBytes(storageRef, file);
        console.log("✅ Uploaded to Firebase Storage");
      
        pdfFileUrl = await getDownloadURL(storageRef);
        console.log("🔗 File URL:", pdfFileUrl);
      }
      
      
      const submissionData = {
        ...values,
        pdfFile: pdfFileName,   // only filename
        pdfFileUrl,             // optional: download URL
        userId: userId
      };

      const result = await submitForm(submissionData);
      
      if (result.success) {
        setSubmitMessage('Form submitted successfully!');
        setFormData({});
        // Reload submissions to show the new one
        loadSubmissions();
      } else {
        setSubmitMessage(result.message);
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationSchema=Yup.object({
    firstName: Yup.string().required('First name is required').max(50),
    lastName: Yup.string().required('Last name is required').max(50),
    dateOfBirth: Yup.date().required('Date of birth is required').max(new Date()),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string()
    .required('Address is required')
    .matches(
      /^[0-9]+[a-zA-Z0-9\s,'-]*$/, 
      'Enter a valid address (e.g., 123 Main St)'
    ),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\+?[0-9\s\-]{7,15}$/, 'Enter a valid phone number'),
    nationality: Yup.string().required('Nationality is required'),
    linkedin: Yup.string()
      .url('Enter a valid URL'),
    language: Yup.string().required('Preferred language is required'),
    notes: Yup.string().max(500, 'Notes must be under 500 characters'),
    pdfFileName: Yup.string().required('PDF is required')
  })
  
  return (
    <div className="container">
      <div className="form-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Personal Information Form</h1>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Logout
          </button>
        </div>

        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f9fafb',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Logged in as:</strong> {user.email}
        </div>

        <p><strong>Please provide your details below. </strong></p>
      
        
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            address: '',
            phone: '',
            nationality: '',
            linkedin: '',
            language: '',
            notes: '',
            pdfFileName: '' 
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
  
          {({ errors, touched, isValid }) => (
            <Form>
              <PersonalInfoStep />

              {submitMessage && (
                <div
                  className={`submit-message ${
                    submitMessage.includes('✅') ? 'success' : 'error'
                  }`}
                  style={{
                    marginTop: '15px',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: submitMessage.includes('✅')
                      ? '#d4edda'
                      : '#f8d7da',
                    color: submitMessage.includes('✅') ? '#155724' : '#721c24',
                  }}
                >
                  {submitMessage}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
      </Formik>

        {/* Admin Panel - User's Submissions */}
        <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #e0e0e0' }}>
          <h2>Your Form Submissions</h2>
          <p>View all your submitted forms below.</p>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <p><strong>Logged in as:</strong> {user.email}</p>
            <p><strong>Total submissions:</strong> {submissionCount}</p>
            <p><strong>Your submissions:</strong> {submissions.length}</p>
          </div>

          {error && (
            <div className="submit-message error">
              {error}
            </div>
          )}

          <button 
            onClick={loadSubmissions} 
            className="btn btn-primary"
            style={{ marginBottom: '20px' }}
          >
            Refresh
          </button>

          {loading ? (
            <p>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p>No submissions yet. Fill out the form above to get started!</p>
          ) : (
            <div className="submissions-list">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-item" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '8px' }}>
                <div className="submission-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3>Submission #{submission.id.slice(-8)}</h3>
                  <span className="submission-date">{formatDate(submission.submittedAt)}</span>
                </div>
                <div className="submission-details" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <p><strong>Name:</strong> {submission.firstName} {submission.lastName}</p>
                  <p><strong>Date of Birth:</strong> {submission.dateOfBirth}</p>
                  <p><strong>Gender:</strong> {submission.gender}</p>
                  <p><strong>Address:</strong> {submission.address}</p>
                  <p><strong>Phone:</strong> {submission.phone}</p>
                  <p><strong>Nationality:</strong> {submission.nationality}</p>
                  <p><strong>LinkedIn:</strong> <a href={submission.linkedin} target="_blank" rel="noopener noreferrer">{submission.linkedin}</a></p>
                  <p><strong>Preferred Language:</strong> {submission.language}</p>
                  <p><strong>Uploaded PDF:</strong> {submission.pdfFileName || 'N/A'}</p>

                  <p><strong>Notes:</strong> {submission.notes || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

export default MultiStepForm;
