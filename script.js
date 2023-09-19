const keywordInput = document.getElementById("keywordInput");
const suggestionsContainer = document.getElementById("suggestions");

const keywords = ["SELECT", "CREATE", "INSERT", "DELETE", "UPDATE", "FROM", "WHERE", "VALUES", "DROP", "TABLE"];

function updateSuggestions() {
	const inputText = keywordInput.value.trim();

	if (inputText === "") {
		suggestionsContainer.innerHTML = "";
		suggestionsContainer.style.display = "none";
		return;
	}

	const lastWord = inputText.split(" ").pop().toUpperCase();

	let filteredKeywords = keywords.filter((keyword) => keyword.startsWith(lastWord));
	filteredKeywords = filteredKeywords.map((keyword) => `<div class="suggestion">${keyword}</div>`).join("");

	suggestionsContainer.innerHTML = filteredKeywords;

	if (filteredKeywords) {
		suggestionsContainer.style.display = "block";
	} else {
		suggestionsContainer.style.display = "none";
	}

	const suggestionElements = document.querySelectorAll(".suggestion");
	suggestionElements.forEach((suggestion) => {
		suggestion.addEventListener("click", () => {
			insertSuggestion(suggestion.innerText);
		});
	});
}

function insertSuggestion(suggestion) {
	const currentInput = keywordInput.value;
	const words = currentInput.split(" ");
	words.pop();
	words.push(suggestion);
	keywordInput.value = words.join(" ") + " ";
	suggestionsContainer.innerHTML = "";
	suggestionsContainer.style.display = "none";
}

keywordInput.addEventListener("input", updateSuggestions);

keywordInput.addEventListener("keydown", (event) => {
	if (event.key === " ") {
		suggestionsContainer.innerHTML = "";
		suggestionsContainer.style.display = "none";
	} else if (event.key === "Tab") {
		const selectedSuggestion = suggestionsContainer.querySelector(".suggestion");
		if (selectedSuggestion) {
			insertSuggestion(selectedSuggestion.innerText);
		}
		event.preventDefault();
	}
});

function executeQuery() {
	let query = keywordInput.value.trim();

	$.ajax({
		url: `http://localhost:5000/execute?${query}`,
		type: "GET",
		headers: { "Access-Control-Allow-Origin": "*" },
		success: function (data) {
			if (data.message) {
				document.getElementById("result").value = data.message;
			} else {
				document.getElementById("result").value = JSON.stringify(data, null, 3);
			}
		},
		error: function (data) {
			return;
		},
	});
}
