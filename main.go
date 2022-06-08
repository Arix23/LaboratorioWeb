package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	r := mux.NewRouter()

	r.HandleFunc("/", puzzleHandler)
	r.HandleFunc("/offline", offlineHandler)
	r.HandleFunc("/SW.js", swHandler)

	fs := http.FileServer(http.Dir("./static/"))
	r.PathPrefix("/stylesheets").Handler(fs)
	r.PathPrefix("/assets").Handler(fs)
	r.PathPrefix("/pkg").Handler(fs)
	r.PathPrefix("/scripts").Handler(fs)

	log.Fatal(http.ListenAndServe(":"+port, r))
}

func puzzleHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	var level string
	for _, c := range r.Cookies() {
		if c.Name == "page" {
			level = c.Value
		}
	}

	log.Println(level)
	switch level {
	case "start":
		http.ServeFile(w, r, "pages/acertijo1.html")
	case "2141347164285616205":
		http.ServeFile(w, r, "pages/acertijo2.html")
	case "7210625651674476027":
		http.ServeFile(w, r, "pages/acertijo3.html")
	case "14933697801197398366":
		http.ServeFile(w, r, "pages/acertijo4.html")
	case "6178077577017668934":
		http.ServeFile(w, r, "pages/acertijo5.html")
	case "9329030690831605389":
		http.ServeFile(w, r, "pages/acertijo6.html")
	case "10436196530010912407":
		http.ServeFile(w, r, "pages/acertijo7.html")
	case "370166626638801698":
		http.ServeFile(w, r, "pages/acertijo8.html")
	case "6035513258945588500":
		http.ServeFile(w, r, "pages/acertijo9.html")
	case "16528679900032520146":
		http.ServeFile(w, r, "pages/acertijo10.html")
	case "13297311963775205858":
		http.ServeFile(w, r, "pages/acertijo11.html")
	case "5279972334124644753":
		http.ServeFile(w, r, "pages/final.html")
	default:
		http.ServeFile(w, r, "pages/index.html")

	}
}

func offlineHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	http.ServeFile(w, r, "pages/offline.html")
}
func swHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	http.ServeFile(w, r, "static/scripts/SW.js")
}
