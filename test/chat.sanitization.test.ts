import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

type FakeElement = {
	tagName: string;
	className: string;
	disabled: boolean;
	value: string;
	scrollHeight: number;
	scrollTop: number;
	style: { height: string };
	_children: FakeElement[];
	classList: {
		add: () => void;
		remove: () => void;
	};
	appendChild: (child: FakeElement) => FakeElement;
	querySelector: (selector: string) => FakeElement | null;
	addEventListener: () => void;
	textContent?: string;
};

function createFakeElement(tagName = "div"): FakeElement {
	return {
		tagName,
		className: "",
		disabled: false,
		value: "",
		scrollHeight: 0,
		scrollTop: 0,
		style: { height: "" },
		_children: [],
		classList: {
			add() {},
			remove() {},
		},
		appendChild(child: FakeElement) {
			this._children.push(child);
			return child;
		},
		querySelector(selector: string) {
			if (selector !== "p") return null;
			return this._children.find(
				(child: { tagName?: string }) => child.tagName === "p",
			);
		},
		addEventListener() {},
	};
}

describe("chat frontend rendering", () => {
	it("renders chat message text as plain text content", () => {
		const chatJsPath = resolve(process.cwd(), "public/chat.js");
		const source = readFileSync(chatJsPath, "utf8");
		const chatMessages = createFakeElement("div");
		const userInput = createFakeElement("textarea");
		const sendButton = createFakeElement("button");
		const typingIndicator = createFakeElement("div");

		const context: Record<string, unknown> = {
			document: {
				getElementById(id: string) {
					if (id === "chat-messages") return chatMessages;
					if (id === "user-input") return userInput;
					if (id === "send-button") return sendButton;
					if (id === "typing-indicator") return typingIndicator;
					return null;
				},
				createElement(tag: string) {
					return createFakeElement(tag);
				},
			},
			console,
			TextDecoder,
			fetch: async () => ({
				ok: false,
			}),
		};

		vm.runInNewContext(source, context);
		expect(typeof context.addMessageToChat).toBe("function");
		(context.addMessageToChat as (role: string, content: string) => void)(
			"user",
			'<img src=x onerror="alert(1)">',
		);

		const renderedMessage = chatMessages._children.at(-1);
		expect(renderedMessage).toBeDefined();
		const paragraph = renderedMessage?.querySelector("p");

		expect(paragraph).not.toBeNull();
		expect(paragraph?.textContent).toBe('<img src=x onerror="alert(1)">');
	});
});
