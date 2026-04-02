import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("chat frontend rendering", () => {
	it("renders chat message text without innerHTML interpolation", () => {
		const chatJsPath = resolve(process.cwd(), "public/chat.js");
		const source = readFileSync(chatJsPath, "utf8");

		expect(source).toContain("paragraph.textContent = content;");
		expect(source).not.toContain("messageEl.innerHTML = `<p>${content}</p>`;");
	});
});
