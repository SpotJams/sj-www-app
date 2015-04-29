package main

import (
	"net/http"
)

func main() {

	var (
		dir  = "www"
		port = "8080"
	)

	h := http.FileServer(http.Dir(dir))
	http.ListenAndServe("0.0.0.0:"+port, h)
}
