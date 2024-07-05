const Notification = ({ text, type }) => {
	if (text === null) {
		return null;
	}

	return <div className={'notification ' + type}>{text}</div>;
};

export default Notification;
