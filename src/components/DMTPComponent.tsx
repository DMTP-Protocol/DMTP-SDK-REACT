/* eslint-disable camelcase */
import * as React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsTelegram, BsDiscord } from 'react-icons/bs'
import { IoCheckmarkCircle } from 'react-icons/io5'
import Stack from 'react-bootstrap/Stack'
import { useAccount, useSNS } from '../hooks/DMTPHook'
import DMTPContext from '../providers/DMTPProvider'
import { Buffer as ImportedBuffer } from 'buffer'

export const DmtpSNS = ({
  redirect_uri_telegram = ''
}: {
  redirect_uri_telegram: string
}) => {
  const {
    isShowSNSState: [show, setShow]
  } = React.useContext(DMTPContext)

  let Buffer
  if (typeof window !== 'undefined') {
    ;(window as any).Buffer = ImportedBuffer
    Buffer = (window as any).Buffer
  } else {
    Buffer = ImportedBuffer
  }

  const handleClose = () => setShow(false)
  const redirect_uri_telegram_base64 = Buffer.from(
    redirect_uri_telegram
  ).toString('base64')

  if (!redirect_uri_telegram)
    throw new Error('redirect_uri_telegram is required.')

  if (redirect_uri_telegram_base64.length > 64)
    throw new Error(
      'redirect_uri_telegram to long in base64 format. Maximum was 64 characters'
    )

  const snsData = useSNS()
  const address = useAccount()
  const is_link_telegram = snsData.snsData?.telegram
  const is_link_discord = snsData.snsData?.discord

  const telegramLink = `https://t.me/dmtp_bot?start=${redirect_uri_telegram_base64}`

  const discordLink = `https://discord.com/api/oauth2/authorize?client_id=857921785633570826&redirect_uri=https%3A%2F%2Fdmtp.tech%2Fdiscord-connect&response_type=code&scope=identify`

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className='fs-6 w-100 text-center text-break'>
          {address}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className='gap-3'>
            <Col className='border'>
              <Stack
                gap={3}
                className='justify-content-between align-items-center pt-3 pb-2 h-100'
              >
                <Stack
                  gap={2}
                  className='justify-content-center align-items-center'
                >
                  <h1 className='fs-6'>Telegram</h1>
                  <BsTelegram color='#0088cc' size={35} />
                </Stack>

                <Stack
                  gap={2}
                  className='justify-content-center align-items-center'
                >
                  {is_link_telegram ? (
                    <IoCheckmarkCircle size={24} color='#0af167' />
                  ) : (
                    <React.Fragment>
                      <Button
                        size='sm'
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open(telegramLink, '_blank')
                          }
                        }}
                        style={{ backgroundColor: '#6559f5' }}
                      >
                        Connect
                      </Button>
                    </React.Fragment>
                  )}
                </Stack>
              </Stack>
            </Col>
            <Col className='border'>
              <Stack
                gap={3}
                className='justify-content-between align-items-center pt-3 h-100 pb-2'
              >
                <Stack
                  gap={2}
                  className='justify-content-center align-items-center'
                >
                  <h1 className='fs-6'>Discord</h1>
                  <BsDiscord color='#5865f2' size={35} />
                </Stack>
                <Stack
                  gap={2}
                  className='justify-content-end align-items-center'
                >
                  {is_link_discord ? (
                    <IoCheckmarkCircle size={24} color='#0af167' />
                  ) : (
                    <Button
                      size='sm'
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.open(discordLink, '_blank')
                        }
                      }}
                      style={{ backgroundColor: '#6559f5' }}
                    >
                      Connect
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}
