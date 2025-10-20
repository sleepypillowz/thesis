import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';

// TypeScript interfaces
interface QueueEntry {
  patient_id: string;
  patient_name: string;
  queue_number: number | null;
  priority_level: string;
  complaint: string;
  status: string;
  created_at: string;
  queue_date: string;
}

interface QueueData {
  month: number;
  year: number;
  entries: QueueEntry[];
}

interface PDFExportProps {
  queueData: QueueData;
  className?: string;
}

// PDF Document Component
const QueuePDFDocument: React.FC<{ queueData: QueueData }> = ({ queueData }) => {
  // Sort entries by queue_number (handle null values)
  const sortedEntries = [...queueData.entries].sort((a, b) => {
    if (a.queue_number === null) return 1;
    if (b.queue_number === null) return -1;
    return a.queue_number - b.queue_number;
  });


  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Patient Queue Report</Text>
          <Text style={styles.subtitle}>
            {new Date(queueData.year, queueData.month - 1).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
          <Text style={styles.generatedDate}>
            Generated on: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{sortedEntries.length}</Text>
            <Text style={styles.summaryLabel}>Total Patients</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>
              {sortedEntries.filter(entry => entry.priority_level === 'Priority').length}
            </Text>
            <Text style={styles.summaryLabel}>Priority Cases</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>
              {sortedEntries.filter(entry => entry.status === 'Waiting').length}
            </Text>
            <Text style={styles.summaryLabel}>Currently Waiting</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.queueCol]}>Queue #</Text>
          <Text style={[styles.tableCell, styles.patientCol]}>Patient ID</Text>
          <Text style={[styles.tableCell, styles.nameCol]}>Patient Name</Text>
          <Text style={[styles.tableCell, styles.priorityCol]}>Priority</Text>
          <Text style={[styles.tableCell, styles.complaintCol]}>Complaint</Text>
          <Text style={[styles.tableCell, styles.statusCol]}>Status</Text>
          <Text style={[styles.tableCell, styles.timeCol]}>Check-in Time</Text>
        </View>

        {/* Table Body */}
        {sortedEntries.map((entry, index) => (
          <View key={entry.patient_id} style={[
            styles.tableRow, 
            index % 2 === 0 ? styles.evenRow : styles.oddRow,
            entry.priority_level === 'Priority' ? styles.priorityRow : {}
          ]}>
            <Text style={[styles.tableCell, styles.queueCol]}>
              {entry.queue_number || 'N/A'}
            </Text>
            <Text style={[styles.tableCell, styles.patientCol]}>
              {entry.patient_id}
            </Text>
            <Text style={[styles.tableCell, styles.nameCol]}>
              {entry.patient_name}
            </Text>
            <Text style={[styles.tableCell, styles.priorityCol, 
              entry.priority_level === 'Priority' ? styles.priorityText : {}]}>
              {entry.priority_level}
            </Text>
            <Text style={[styles.tableCell, styles.complaintCol]}>
              {entry.complaint}
            </Text>
            <Text style={[styles.tableCell, styles.statusCol]}>
              {entry.status}
            </Text>
            <Text style={[styles.tableCell, styles.timeCol]}>
              {formatTime(entry.created_at)}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Report generated from Healthcare Queue Management System
          </Text>
          <Text style={styles.footerPage}>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Export Component
const QueuePDFExport: React.FC<PDFExportProps> = ({ queueData, className = "" }) => {
  const fileName = `queue-report-${queueData.year}-${String(queueData.month).padStart(2, '0')}.pdf`;

  return (
    <div className={className}>
      <PDFDownloadLink
        document={<QueuePDFDocument queueData={queueData} />}
        fileName={fileName}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
      >
        {({loading}) => (
          <>
            <Download className="w-4 h-4" />
            {loading ? 'Generating PDF...' : 'Export Queue Report'}
          </>
        )}
      </PDFDownloadLink>
    </div>
  );
};

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  generatedDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 5,
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  summaryLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    minHeight: 25,
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#F9FAFB',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  priorityRow: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
    color: '#374151',
  },
  queueCol: { width: '10%', textAlign: 'center' },
  patientCol: { width: '15%' },
  nameCol: { width: '20%' },
  priorityCol: { width: '12%', textAlign: 'center' },
  complaintCol: { width: '18%' },
  statusCol: { width: '15%' },
  timeCol: { width: '10%', fontSize: 7 },
  priorityText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#6B7280',
  },
  footerPage: {
    fontSize: 8,
    color: '#6B7280',
  },
});

export default QueuePDFExport;