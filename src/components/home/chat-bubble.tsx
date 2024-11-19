import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import ReactPlayer from "react-player";

type ChatBubbleProps = {
	message: IMessage;
	me: any;
	previousMessage?: IMessage;
}

// Chat Bubble
const ChatBubble = ({me,message, previousMessage}: ChatBubbleProps) => {

	const date = new Date(message._creationTime);
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	const time = `${hour}:${minute}`;

	const { selectedConversation } = useConversationStore();
	const isMember = selectedConversation?.participants.includes(message.sender._id) || false;
	const isGroup = selectedConversation?.isGroup;
	const fromMe = message.sender._id === me._id;
	const bgClass = fromMe ? "bg-blue-400" : " dark: bg-gray-primary";

	const [open, setOpen] = useState(false);

	const renderMessageContent = () => {
		switch (message.messageType) {
			case "text":
				return <TextMessage message={message} />;
			case "image":
				return <ImageMessage message={message} handleClick={() => setOpen(true)} />;
			case "video":
				return <VideoMessage message={message} />;
			default:
				return null;
		}
	};

	if(!fromMe) {
		return (
			<>
			<DateIndicator message={message} previousMessage={previousMessage} />
			  <div className="flex gap-1 w-2/3">
			  <ChatBubbleAvatar isGroup={isGroup} isMember={isMember} message={message} fromAI={false}/>
			    <div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-full shadow-md relative ${bgClass}`}>
				<OtherMessageIndicator />
				{renderMessageContent()}
					{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
				  <MessageTime time={time} fromMe={fromMe} />
			    </div>
			  </div>
			</>
		)
	}
		return (
			<>
			<DateIndicator message={message} previousMessage={previousMessage} />

			  <div className="flex gap-1 w-2/3 ml-auto">
			    <div className={`flex z-20 max-w-fit px-2 pt-1 rounded-full shadow-md ml-auto relative ${bgClass}`}>
				  <SelfMessageIndicator />
				  {renderMessageContent()}
				  {open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
				  <MessageTime time={time} fromMe={fromMe} />
			    </div>
			  </div>
			</>
		)
	};
export default ChatBubble;

// Video Message
const VideoMessage = ({ message }: { message: IMessage }) => {
	return <ReactPlayer url={message.content} width='250px' height='250px' controls={true} light={true} />;
};


// Image message
const ImageMessage = ({ message, handleClick} : { message: IMessage; handleClick: () => void }) => {
	return (
		<div className='w-[250px] h-[250px] m-2 relative'>
			<Image
				src={message.content}
				fill
				className='cursor-pointer object-cover rounded'
				alt='image'
				onClick={handleClick}
			/>
		</div>
	)
}

// Message Indicator
const OtherMessageIndicator = () => (
	<div className='absolute top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);

// Self Message Indicator
const SelfMessageIndicator = () => (
	<div className='absolute top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);

//Image Dialog
const ImageDialog = ({ src, onClose, open }: { open: boolean; src: string; onClose: () => void }) => {
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className='min-w-[750px]'>
				<DialogDescription className='relative h-[450px] flex justify-center'>
					<Image src={src} fill className='rounded-lg object-contain' alt='image' />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

// Message Time
const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
	return (
		<p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
			{time} {fromMe && <MessageSeenSvg />}
		</p>
	);
};

// Text Message ()
const TextMessage = ({ message }: { message: IMessage }) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

	return (
		<div>
			{isLink ? (
				<a
					href={message.content}
					target='_blank'
					rel='noopener noreferrer'
					className={`mr-2 text-sm font-light text-blue-400 underline`}
				>
					{message.content}
				</a>
			) : (
				<p className={`mr-2 text-sm font-light`}>{message.content}</p>
			)}
		</div>
	);
};