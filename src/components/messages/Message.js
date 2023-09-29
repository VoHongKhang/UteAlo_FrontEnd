
const Meessage = ({ message }) => {

    return (
        <div className="message">
            <div className="messageTop">
                <img className="messageImg" src={message?.sender?.avatar} alt="" />
                <p className="messageText">{message?.content}</p>
            </div>
            <div className="messageBottom">{message?.createdAt}</div>
        </div>
    );
};
export default Meessage;