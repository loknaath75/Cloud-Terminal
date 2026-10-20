import React, { useState } from 'react';
import { Dropbox } from 'dropbox';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cloud,
  Trash2,
  KeyRound
} from 'lucide-react';

// Default hardcoded token from user
const DEFAULT_TOKEN = 'sl.u.AG3FYMSXidsp6g7uR352cV8wbLn-PlJzho0qKWupTQy1Q0jfTNcodg_H8XtOGhYvyMUS2Fp3yed0SiE_ceXGZeghkeO1TiGDlrQj3l8Pez-blsyJEz571Y42zjq1HImMfQqelL1nPKy5IpPXZgdItK1jZY2wufeNsCuFp_AB7kftjpLqrUjtOeksi8EH1w9jFuvI_mplquMU_yFWrMO8syxoVR8UAMrH3TFRjPL9TQK8fx4xoX1U-RfH7SWe1oOvpDIviW5Mq4TVbMXuNU1L6JEvRdDCoW8lHkm6YxPyeYbbWDGcMBT-jHt-8lnoEjwJQonSdLEuYGOBtxd1LT5jCmhZPar9rBo_MjLPQVDxmsHxACnN2zGaQpWj2cFdxgYkDQ2cSSsLvDp6Vy4tyegFDvuD_jYmfNwkKxDVfvzQTHYxWyxPPLhnVMhufCitiQRArLhh8RnzDbmwuIJ3buNOetxsZXpiUAm1x2-yYO-IYzdt1Exj61Iw4MxhUSQNpmGP78G5zzYAVuAwy5vhqeVIXvUU0NLP2jk_5efbhT2IVfcD6wK_QeRuvZLH8B2grKm_wHOYuAYdY_UNJ5BQRv2nFN5at5JPrJU9QUjFea8FT2McTMu5xxdDsYwkJzud1NFL8ni6FaU7IV4m-dDU-0KPuoZsIsPN2GCPmHHnii5Mw5xpKiHwA29h9Mn4hoqkHM9AxwxriDNQWMXu8jitBhyNZ8iXjA2dUW3xRFtnmO0A-gE3tOgks-FP4LTZweKpthHnsQp9RGT-SQBCeTTaKsIrPj64e20UL4P2d-kLupOXxK23x2WhjACFb8Y-KVENz5w7yr_Crq7RAuBtbSPtW_aFj-Bdo3qDrGcJTmh19FONtwD1fS3IoPEx4MwnugQsfwji_uCymVV1OoV0LHbhwBTvkypiLbfkp8Wy2iAq0cfDrZZN5fZD0IsDHyWvRCI9CXBDOji9bRTLNjih2jY34ohz3ztFqA8Z5xSahak6AiSjo6ygEmZH7399P5FuS_ifFlfmJO4vyKvVk8lb9CIdpv0u3RPFn9aQLx0KqpPDpvCiQyg--tiAP-owM9Fkj3XU8rYv-La6l8qV7dbfiG1j5b4WnEHG6-Qv_CDUveHY9wbSf0BYWRgKtkiT_MHNiEI8FMA58f3dpoked6365wsDSu0_CvEkQAcg6Rg_mpDHZtiJxDUhHCbZgtd6XPZ4zRyzKQPy8Cpj3OAul9LwZS3UVbIZeyc5eW_sqtoOfgwNQonjatXjkPGDzyannduGAGbdIW0ZN4OVJ5mRDBYBsohVL8xUPrX7Ni4BVE1XW861MYYS-nL0X8ilx0uCXl2Gw3YVZ1wpX3eijd7YOJnpQdEfInzPfUoWWr-6rl0MKjgU8PXooPL9dhTxwxZeBTGba81_rBjLcqJFMQSXJTgzWBg7PKXkZT7BfW57s-k2ukjuIOZxbVZleA';

export default function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [isEditingToken, setIsEditingToken] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setUploadResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setUploadResult(null);

    try {
      const activeToken = token.trim();
      const dbx = new Dropbox({ accessToken: activeToken });

      const response = await dbx.filesUpload({
        path: `/${file.name}`,
        contents: file,
        mode: 'add',
        autorename: true
      });

      setUploadResult(response.result);
    } catch (err) {
      console.error('Upload Error:', err);

      const tag = err?.error?.error?.['.tag'] || err?.error?.error_summary || '';
      if (tag.includes('invalid_access_token') || err?.status === 401) {
        setError('invalid_access_token: The Dropbox token has expired or is invalid. Please click "Generate" again in your Dropbox App Console under Settings > OAuth 2.');
      } else {
        const errMsg = err?.error?.error_summary || err?.message || 'Failed to upload file to Dropbox.';
        setError(errMsg);
      }
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="upload-container">
      {/* Header */}
      <header className="upload-header">
        <div className="header-icon">
          <Cloud size={26} color="#000000" strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <h1>Dropbox Cloud Uploader</h1>
        </div>

        {/* Small token update toggle if token expires */}
        {/* <button
          type="button"
          onClick={() => setIsEditingToken(!isEditingToken)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: '#a3a3a3',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Change Token"
        >
          <KeyRound size={14} />
          <span>{isEditingToken ? 'Hide' : 'Update Token'}</span>
        </button> */}
      </header>

      {/* Main Upload Card */}
      <div className="upload-card">
        <form onSubmit={handleUpload}>
          {/* Optional inline token updater if expired */}
          {isEditingToken && (
            <div className="form-section">
              <label className="field-label">
                <KeyRound size={15} color="#ffffff" />
                <span>Dropbox Access Token</span>
              </label>
              <input
                type="text"
                className="text-input"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setError('');
                }}
                placeholder="sl.u.AF..."
              />
            </div>
          )}

          <div className="form-section">
            <div className="dropzone-box">
              <input
                type="file"
                id="file-upload"
                className="hidden-file-input"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="dropzone-label">
                <UploadCloud size={44} color="#ffffff" />
                <span className="dropzone-title">
                  {file ? file.name : 'Click to select or drop a file here'}
                </span>
                <span className="dropzone-subtitle">
                  {file ? `${formatBytes(file.size)} • Ready for Dropbox upload` : 'Supports all file formats'}
                </span>
              </label>

              {file && (
                <button
                  type="button"
                  className="clear-file-btn"
                  onClick={() => {
                    setFile(null);
                    setUploadResult(null);
                    setError('');
                  }}
                  title="Remove selected file"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Authentication / Upload Failed</strong>
                <p style={{ marginTop: '4px', fontSize: '0.82rem' }}>{error}</p>
              </div>
            </div>
          )}

          {/* Success Result */}
          {uploadResult && (
            <div className="alert alert-success">
              <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.95rem' }}>Uploaded Successfully to Dropbox!</strong>
                {/* <div className="result-details">
                  <div><span>File Name:</span> <code>{uploadResult.name}</code></div>
                  <div><span>Dropbox Path:</span> <code>{uploadResult.path_display}</code></div>
                  <div><span>File ID:</span> <code>{uploadResult.id}</code></div>
                  <div><span>Size:</span> <code>{formatBytes(uploadResult.size)}</code></div>
                  <div><span>Server Modified:</span> <code>{new Date(uploadResult.server_modified).toLocaleString()}</code></div>
                </div> */}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={uploading || !file}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Uploading to Dropbox...</span>
              </>
            ) : (
              <>
                <UploadCloud size={18} />
                <span>Upload to Dropbox</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
