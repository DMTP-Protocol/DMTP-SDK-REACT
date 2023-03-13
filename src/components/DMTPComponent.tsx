import * as React from 'react'

export const DmtpSNS = ({
  redirect_uri_telegram = ''
}: {
  redirect_uri_telegram: string
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
              window.open(
                `https://t.me/dmtp_dev_bot?start=${Buffer.from(
                  redirect_uri_telegram
                ).toString('base64')}`,
                '_blank'
              )
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
              window.open(
                `https://discord.com/api/oauth2/authorize?client_id=1034407375186169909&redirect_uri=http%3A%2F%2F18.181.234.171&response_type=code&scope=identify`,
                '_blank'
              )
            }}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  )
}
