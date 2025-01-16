document.getElementById("summarizeBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "summarize" }, (response) => {
        const output = document.getElementById("output");
        const brevity = document.getElementById("brevity").value;
        const format = document.getElementById("format").value;

        let summary = response?.summary || "No summary available.";

        // Placeholder logic for brevity
        if (brevity === "short") summary = summary.substring(0, 100);
        else if (brevity === "medium") summary = summary.substring(0, 250);

        // Placeholder logic for format
        if (format === "bullets") {
            summary = summary
                .split('. ')
                .map(sentence => `• ${sentence}`)
                .join('<br>');
        }

        output.innerHTML = summary;
    });
});
