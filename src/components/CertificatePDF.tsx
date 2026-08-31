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
  
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
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
    fontFamily: 'Times-Roman',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
  },
  controlNumber: {
    position: 'absolute',
    top: 175, // Ajustado para ficar abaixo do brasão
    right: 70,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: '#333333',
    textAlign: 'right',
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 160, // Espaço do cabeçalho
    paddingBottom: 130, // Espaço da assinatura
    paddingHorizontal: 70,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: 'Times-Roman',
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 20,
    color: '#111827',
  },
  boldText: {
    fontFamily: 'Times-Bold',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    color: '#111827',
  },
  signatureContainer: {
    position: 'absolute',
    bottom: 75,
    left: 70,
    right: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureBlock: {
    alignItems: 'center',
    width: 280,
  },
  signatureImage: {
    width: 140,
    height: 60,
    objectFit: 'contain',
    marginBottom: 2,
    zIndex: 10,
  },
  signatureLine: {
    width: 280,
    height: 1,
    backgroundColor: '#111827',
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: '#111827',
  },
  signatureRole: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: '#111827',
    marginTop: 2,
  },
  signatureRegistry: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: '#111827',
    marginTop: 1,
  },
  footerRight: {
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 8,
    textAlign: 'right',
    lineHeight: 1.5,
    color: '#6b7280',
    fontFamily: 'Times-Roman',
  }
});

interface CertificateProps {
  key?: React.Key;
  student: StudentData;
  directorName: string;
  directorRegistry: string;
  directorSignature: string | null;
}

export const CertificatePage = ({ student, directorName, directorRegistry, directorSignature }: CertificateProps) => (
  <Page size="A4" orientation="landscape" style={styles.page}>
    <Image src="/template.png" style={styles.backgroundImage} fixed={true} />
    
    <View style={styles.contentContainer}>
      <Text style={styles.controlNumber}>{student.controlNumber}</Text>
      
      <View style={styles.textWrapper}>
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
          Brasília-DF, {formatDateExtenso(student.issueDate)}.
        </Text>
      </View>

      <View style={styles.signatureContainer}>
        <View style={styles.signatureBlock}>
          {directorSignature ? (
            <Image src={directorSignature} style={styles.signatureImage} />
          ) : (
            <View style={{ height: 60 }} />
          )}
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>{directorName.toUpperCase()}</Text>
          <Text style={styles.signatureRole}>Diretor Geral</Text>
          {directorRegistry && <Text style={styles.signatureRegistry}>{directorRegistry}</Text>}
        </View>
        
        <View style={styles.footerRight}>
          <Text style={styles.footerText}>CNPJ Nº 21.744.847/0001-50</Text>
          <Text style={styles.footerText}>BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO</Text>
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

export const BulkCertificatePDF = ({ students, directorName, directorRegistry, directorSignature }: { students: StudentData[], directorName: string, directorRegistry: string, directorSignature: string | null }) => (
  <Document>
    {students.map((student, index) => (
      <CertificatePage 
        key={index} 
        student={student} 
        directorName={directorName} 
        directorRegistry={directorRegistry}
        directorSignature={directorSignature} 
      />
    ))}
  </Document>
);
