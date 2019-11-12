build:
	# Cleanup the artifacts folder, create the distribution location.
	rm -rf artifacts || true
	mkdir artifacts
	mkdir artifacts/dist

	# Copy over the static site files.
	cp -r index.html game.js stack.js states levels artifacts/dist/.

.PHONY: build
