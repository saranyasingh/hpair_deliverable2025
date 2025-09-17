import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';

const PersonalInfoStep = () => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <div>
      <h2>Personal Information</h2>
      <p>Please provide your details below.</p>

      {/* First Name */}
      <div className="form-group">
        <label className="form-label">First Name *</label>
        <Field 
          type="text" 
          name="firstName"
          className="form-input"
          placeholder="Enter your first name"
        />
        <ErrorMessage name="firstName" component="div" className="error" />
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label className="form-label">Last Name *</label>
        <Field 
          type="text" 
          name="lastName"
          className="form-input"
          placeholder="Enter your last name"
        />
        <ErrorMessage name="lastName" component="div" className="error" />
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label className="form-label">Date of Birth *</label>
        <Field 
          type="date" 
          name="dateOfBirth"
          className="form-input"
        />
        <ErrorMessage name="dateOfBirth" component="div" className="error" />
      </div>

      {/* Gender */}
      <div className="form-group">
        <label className="form-label">Gender *</label>
        <Field as="select" name="gender" className="form-input">
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </Field>
        <ErrorMessage name="gender" component="div" className="error" />
      </div>

      {/* Address */}
      <div className="form-group">
        <label className="form-label">Address *</label>
        <Field 
          type="text" 
          name="address"
          className="form-input"
          placeholder="Street, City, Country"
        />
        <ErrorMessage name="address" component="div" className="error" />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label className="form-label">Phone Number *</label>
        <Field 
          type="tel" 
          name="phone"
          className="form-input"
          placeholder="+1 123 456 7890"
        />
        <ErrorMessage name="phone" component="div" className="error" />
      </div>

      {/* Nationality */}
      <div className="form-group">
        <label className="form-label">Nationality *</label>
        <Field 
          type="text" 
          name="nationality"
          className="form-input"
          placeholder="Enter your nationality"
        />
        <ErrorMessage name="nationality" component="div" className="error" />
      </div>

      {/* LinkedIn */}
      <div className="form-group">
        <label className="form-label">LinkedIn URL *</label>
        <Field 
          type="url" 
          name="linkedin"
          className="form-input"
          placeholder="https://linkedin.com/in/username"
        />
        <ErrorMessage name="linkedin" component="div" className="error" />
      </div>

      {/* Preferred Language */}
      <div className="form-group">
        <label className="form-label">Preferred Language *</label>
        <Field as="select" name="language" className="form-input">
          <option value="">Select language</option>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="mandarin">Mandarin</option>
          <option value="other">Other</option>
        </Field>
        <ErrorMessage name="language" component="div" className="error" />
      </div>

      {/* CV Upload */}
      <div className="form-group">
        <label className="form-label">Upload CV *</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            const file = event.currentTarget.files[0];
            if (file) {
              // Store just the filename in Formik
              setFieldValue("pdfFileName", file.name);
            }
          }}
        />

        {/* Show uploaded filename */}
        {values.pdfFileName && (
          <p style={{ marginTop: "10px" }}>
            Uploaded: <strong>{values.pdfFileName}</strong>
          </p>
        )}

        {/* Optional error handling */}
        <ErrorMessage name="pdfFileName" component="div" className="error" />
      </div>
  

      {/* Extra field: Notes */}
      <div className="form-group">
        <label className="form-label">Additional Notes (optional)</label>
        <Field 
          as="textarea" 
          name="notes"
          className="form-input"
          placeholder="Anything you'd like to add..."
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
