import * as React from 'react'

interface DmtpSNSProps {
  text: string
}

export const DmtpSNS = ({ text }: DmtpSNSProps) => {
  return <div>DMTP SNS: {text}</div>
}
