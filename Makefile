install: 
	npm i
prettier:
	npx prettier --write .

lint:
	npx eslint . 

publish:
	npm publish --dry-run

test:
	npm test 

tests-coverage:
	npx jest --coverage
