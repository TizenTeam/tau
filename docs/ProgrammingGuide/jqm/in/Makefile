CITE = ./cite
SRC = ./
OUT = .

all: parse

clean:
	@rm ../*.html

parse:
	@@for d in `find ${SRC} -type d | sort`; do \
		mkdir -p .$$d; \
	done;
	@@for f in `find ${SRC} -iname '*.in' | sort`; do \
		echo "$$f"; \
		${CITE} $$f ${OUT}$$f; \
		rename -f 's/\.in$///' "${OUT}$$f"; \
	done;
