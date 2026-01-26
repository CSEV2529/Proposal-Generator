import { StyleSheet } from '@react-pdf/renderer';

export const colors = {
  primary: '#3CB371',
  primaryDark: '#2E8B57',
  text: '#333333',
  textLight: '#666666',
  border: '#E5E7EB',
  background: '#F9FAFB',
  white: '#FFFFFF',
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: colors.white,
  },
  pageWithHeader: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: -40,
    marginTop: -20,
  },
  headerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 10,
    marginTop: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 5,
  },
  text: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
    marginBottom: 5,
  },
  textSmall: {
    fontSize: 8,
    color: colors.textLight,
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 8,
  },
  tableHeaderCell: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 8,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 8,
    backgroundColor: colors.background,
  },
  tableCell: {
    fontSize: 9,
    color: colors.text,
  },
  tableCellRight: {
    fontSize: 9,
    color: colors.text,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  col2: {
    flex: 2,
  },
  col3: {
    flex: 3,
  },
  box: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 15,
    marginVertical: 10,
  },
  boxHighlight: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#F0FFF4',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    marginTop: 30,
    marginBottom: 5,
    width: '60%',
  },
  signatureLabel: {
    fontSize: 8,
    color: colors.textLight,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: colors.textLight,
  },
  bullet: {
    width: 15,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
});
