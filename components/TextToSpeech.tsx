"use client";
import { AppContext } from "../pages/context/isPlayingContext";
import React, { FormEvent, useContext, useState } from "react";
import yt from "../public/yt.png";
import Link from "next/link";
import Image from "next/image";
import sendTextToOpenAi from "openai";

export const TextToSpeech = () => {
	const [userText, setUserText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { isPlaying, setIsPlaying } = useContext(AppContext);
	const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
	const voices = synth?.getVoices();

	const seletedVoice = voices?.find((voice) => voice.name === "Albert"); // Other voice that sounds good Karen, Tessa, Trinoids

	const speak = (textToSpeak: string) => {
		const utterance = new SpeechSynthesisUtterance(textToSpeak);
		utterance.rate = 0.8;
		utterance.voice = seletedVoice!;

		synth?.speak(utterance);
		setIsPlaying(true);
		utterance.onend = () => {
			setIsPlaying(false);
		};
	};

	async function handleUserText(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (userText === "") return alert("Please enter text");
		setIsLoading(true);
		try {
			const message = await (userText);
			speak(message);
		} catch (error) {
			let message = "";
			if (error instanceof Error) message = error.message;
			console.log(message);
		} finally {
			setIsLoading(false);
			setUserText("");
		}
	}

	return (
		<div className="relative top-0 z-50 ">
			<form
				onSubmit={handleUserText}
				className="absolute top-[750px] left-[35%]  space-x-2 pt-2 "
			>
				<input
					type="text"
					value={userText}
					className="bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none  rounded-lg placeholder:text-[#b00c3f] p-2 text-[#b00c3f]"
					onChange={(e) => setUserText(e.target.value)}
					placeholder="What do you want to speak...."
				/>
				<button
					disabled={isLoading}
					className="text-[#b00c3f] p-2 border border-[#b00c3f] rounded-lg disabled:text-blue-100 
					disabled:cursor-not-allowed disabled:bg-gray-500 hover:scale-110 hover:bg-[#b00c3f] hover:text-black duration-300 transition-all"
				>
					{isLoading ? "Speaking..." : "Speak"}
				</button>
			</form>
			<div className="absolute top-3 right-3 ">
				<Link
					target="_blank"
					href={"https://www.linkedin.com/in/martinvallejoz/"}
				>
					<Image src={yt} alt="yt" height={50} width={50} />
				</Link>
				<div className="absolute top-0 bg-black/60" />
			</div>
		</div>
	);
};