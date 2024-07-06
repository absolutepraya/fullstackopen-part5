import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Notification = forwardRef((props, ref) => {
	const [message, setMessage] = useState({ text: null, type: null })

	useImperativeHandle(ref, () => ({
		show(newMessage) {
			setMessage(newMessage)
		},
	}))

	if (message.text === null) {
		return null
	}

	return <div className={'notification ' + message.type}>{message.text}</div>
})

Notification.displayName = 'Notification'

Notification.propTypes = {
	message: PropTypes.object,
}

export default Notification
