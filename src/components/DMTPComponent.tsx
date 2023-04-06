import * as React from 'react'

export const DmtpSNS = ({
  redirect_uri_telegram = '',
  isDev = false
}: {
  redirect_uri_telegram: string
  isDev: boolean
}) => {
  const redirect_uri_telegram_base64 = Buffer.from(
    redirect_uri_telegram
  ).toString('base64')

  if (!redirect_uri_telegram)
    throw new Error('redirect_uri_telegram is required.')

  if (redirect_uri_telegram_base64.length > 64)
    throw new Error(
      'redirect_uri_telegram to long in base64 format. Maximum was 64 characters'
    )

  const is_link_telegram = false
  const is_link_discord = false

  const telegramLink = `https://t.me/${
    isDev ? 'dmtp_dev_bot' : 'dmtp_bot'
  }?start=${redirect_uri_telegram_base64}`

  const discordLink = `https://discord.com/api/oauth2/authorize?client_id=1034407375186169909&redirect_uri=${
    isDev ? 'http://18.181.234.171' : 'https://dmtp.tech'
  }/discord-connect&response_type=code&scope=identify`

  return (
    <div>
      <p />
      <div>Telegram</div>
      <div>
        {is_link_telegram ? (
          <div>Linked</div>
        ) : (
          <button
            onClick={() => {
              window.open(telegramLink, '_blank')
            }}
          >
            Connect
          </button>
        )}
      </div>
      <p />
      <div>Discord</div>
      <div>
        {is_link_discord ? (
          <div>Linked</div>
        ) : (
          <button
            onClick={() => {
              window.open(discordLink, '_blank')
            }}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  )
}
