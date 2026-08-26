import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { StudentData } from '../types';

const formatDateExtenso = (dateStr: string) => {
  if (!dateStr) return '';
  let year, month, day;
  if (dateStr.includes('-')) {
    [year, month, day] = dateStr.split('-');
  } else if (dateStr.includes('/')) {
    [day, month, year] = dateStr.split('/');
  } else {
    return dateStr;
  }
  
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const monthName = months[parseInt(month, 10) - 1];
  if (monthName) return `${parseInt(day, 10)} de ${monthName} de ${year}`;
  return dateStr;
};

const formatPeriodExtenso = (start: string, end: string, fallback?: string) => {
  if (!start || !end) return fallback || '';
  
  const parseDate = (d: string) => {
    if (d.includes('-')) return d.split('-');
    if (d.includes('/')) {
      const [day, month, year] = d.split('/');
      return [year, month, day];
    }
    return [];
  };
  
  const [sYear, sMonth, sDay] = parseDate(start);
  const [eYear, eMonth, eDay] = parseDate(end);
  
  if (!sYear || !eYear) return fallback || '';

  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const sMonthName = months[parseInt(sMonth, 10) - 1];
  const eMonthName = months[parseInt(eMonth, 10) - 1];

  if (sYear === eYear && sMonth === eMonth) {
      return `${parseInt(sDay, 10)} a ${parseInt(eDay, 10)} de ${sMonthName} de ${sYear}`;
  } else if (sYear === eYear) {
      return `${parseInt(sDay, 10)} de ${sMonthName} a ${parseInt(eDay, 10)} de ${eMonthName} de ${sYear}`;
  } else {
      return `${parseInt(sDay, 10)} de ${sMonthName} de ${sYear} a ${parseInt(eDay, 10)} de ${eMonthName} de ${eYear}`;
  }
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fafaf9', // Um tom levemente off-white/papel
    padding: 20,
    fontFamily: 'Times-Roman',
  },
  outerBorder: {
    border: '6pt solid #1e3a8a', // Azul escuro militar
    padding: 3,
    height: '100%',
  },
  middleBorder: {
    border: '1.5pt solid #d97706', // Dourado
    padding: 3,
    height: '100%',
  },
  innerBorder: {
    border: '2pt solid #1e3a8a',
    height: '100%',
    padding: 35,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  logo: {
    width: 65,
    height: 85,
    objectFit: 'contain',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 42,
    color: '#d97706',
    fontFamily: 'Times-Bold',
    letterSpacing: 8,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1e3a8a',
    textTransform: 'uppercase',
  },
  divider: {
    width: 250,
    height: 2,
    backgroundColor: '#d97706',
    marginVertical: 10,
  },
  controlNumber: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textAlign: 'right',
    width: '100%',
    marginTop: 10,
    color: '#333333',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 1.8,
    textAlign: 'justify',
    marginTop: 35,
    marginBottom: 40,
    color: '#111827',
  },
  boldText: {
    fontFamily: 'Times-Bold',
  },
  italicText: {
    fontFamily: 'Times-Italic',
  },
  date: {
    fontSize: 15,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 60,
    color: '#1e3a8a',
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 35,
    left: 35,
    right: 35,
    alignItems: 'flex-end',
  },
  signatureBlock: {
    alignItems: 'center',
    width: '45%',
  },
  signatureImage: {
    width: 140,
    height: 70,
    objectFit: 'contain',
    marginBottom: 5,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#000',
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
  },
  signatureRole: {
    fontSize: 11,
    color: '#4b5563',
  },
  footerRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '50%',
  },
  footerText: {
    fontSize: 9,
    textAlign: 'right',
    lineHeight: 1.5,
    color: '#6b7280',
    fontFamily: 'Times-Bold',
  }
});

interface CertificateProps {
  key?: React.Key;
  student: StudentData;
  directorName: string;
  directorSignature: string | null;
  leftBadge: string | null;
  rightBadge: string | null;
}

export const CertificatePage = ({ student, directorName, directorSignature, leftBadge, rightBadge }: CertificateProps) => (
  <Page size="A4" orientation="landscape" style={styles.page}>
    <View style={styles.outerBorder}>
      <View style={styles.middleBorder}>
        <View style={styles.innerBorder}>
          
          <View style={styles.header}>
            {leftBadge ? (
              <Image src={leftBadge} style={styles.logo} />
            ) : (
              <View style={styles.logo} />
            )}
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>CERTIFICADO</Text>
              <Text style={styles.subtitle}>{student.course}</Text>
              <View style={styles.divider} />
              <Text style={styles.controlNumber}>{student.controlNumber}</Text>
            </View>

            {rightBadge ? (
              <Image src={rightBadge} style={styles.logo} />
            ) : (
              <View style={styles.logo} />
            )}
          </View>

          <Text style={styles.bodyText}>
            A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias – 
            (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que <Text style={styles.boldText}>{student.name.toUpperCase()}</Text>, 
            inscrito no CPF nº <Text style={styles.boldText}>{student.cpf}</Text> e no Nº REGISTRO <Text style={styles.boldText}>{student.registry}</Text>, 
            categoria "<Text style={styles.boldText}>{student.category}</Text>", concluiu com aproveitamento o Curso Especializado 
            para <Text style={styles.boldText}>{student.course}</Text>, ministrado pela IET - Forte Caxias, no período de 
            {' '}<Text style={styles.boldText}>{formatPeriodExtenso(student.periodStart, student.periodEnd, student.period)}</Text>, com carga horária de <Text style={styles.boldText}>{student.workload}</Text>, 
            com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.
          </Text>

          <Text style={styles.date}>
            Brasília-DF, {formatDateExtenso(student.issueDate)}
          </Text>

          <View style={styles.signatureContainer}>
            <View style={styles.signatureBlock}>
              {directorSignature ? (
                <Image src={directorSignature} style={styles.signatureImage} />
              ) : (
                <View style={{ height: 70 }} />
              )}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{directorName.toUpperCase()}</Text>
              <Text style={styles.signatureRole}>Diretor Geral</Text>
            </View>
            
            <View style={styles.footerRight}>
              <Text style={styles.footerText}>CNPJ Nº 21.744.847/0001-50</Text>
              <Text style={styles.footerText}>BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO</Text>
            </View>
          </View>

        </View>
      </View>
    </View>
  </Page>
);

export const SingleCertificatePDF = (props: CertificateProps) => (
  <Document>
    <CertificatePage {...props} />
  </Document>
);

export const BulkCertificatePDF = ({ students, directorName, directorSignature, leftBadge, rightBadge }: { students: StudentData[], directorName: string, directorSignature: string | null, leftBadge: string | null, rightBadge: string | null }) => (
  <Document>
    {students.map((student, index) => (
      <CertificatePage 
        key={index} 
        student={student} 
        directorName={directorName} 
        directorSignature={directorSignature} 
        leftBadge={leftBadge}
        rightBadge={rightBadge}
      />
    ))}
  </Document>
);
