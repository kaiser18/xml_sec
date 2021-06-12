package logger

import(
    log "github.com/sirupsen/logrus"
    "os"
    "fmt"
)

var FILE *os.File

func FileOpen() {
    file, err := os.OpenFile("logs.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
    if err != nil {
        log.Fatal(err)
    }

    log.SetOutput(file)
    // log.Print("Logging to a file in Go!")
    FILE = file
    fmt.Println("FILE Opened")
}

func FileClose(file *os.File) {
    defer file.Close()
    fmt.Println("FILE Closed")
}
