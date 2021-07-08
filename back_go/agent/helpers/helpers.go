package helpers

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
    "net/smtp"
	"os"
    "io"
	"strings"
    "strconv"
	"time"
    "bytes"
    "crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"database/sql/driver"
	"errors"
)

//****************************************************************
const ExpiresIn = 86400 //24h

var TokenSecret = ""

type TokenClaims struct {
	LoggedUserId uint `json:"loggedUserId"`
	jwt.StandardClaims
}

func initPublicToken() {
	env := os.Getenv("PUBLIC_JWT_TOKEN_SECRET")
	if env == "" {
		TokenSecret = "token_secret"
	} else {
		TokenSecret = env
	}
}

func CreateToken(userId uint, issuer string) (string, error) {
	if TokenSecret == "" {
		initPublicToken()
	}
	claims := TokenClaims{LoggedUserId: userId, StandardClaims: jwt.StandardClaims{
		ExpiresAt: time.Now().Unix() + ExpiresIn,
		IssuedAt:  time.Now().Unix(),
		Issuer:    issuer,
	}}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(TokenSecret))
}

func getToken(header http.Header) (string, error) {
	reqToken := header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	if len(splitToken) != 2 {
		return "", fmt.Errorf("NO_TOKEN")
	}
	return strings.TrimSpace(splitToken[1]), nil
}

func GetLoggedUserIDFromToken(r *http.Request) uint {
	if TokenSecret == "" {
		initPublicToken()
	}
	tokenString, err := getToken(r.Header)
	if err != nil {
		fmt.Println(err)
		return 0
	}
	token, err := jwt.ParseWithClaims(tokenString, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(TokenSecret), nil
	})
	if err != nil {
		fmt.Println(err)
		return 0
	}
	if claims, ok := token.Claims.(*TokenClaims); ok && token.Valid {
		return claims.LoggedUserId
	} else {
		fmt.Println(err)
		return 0
	}
}

//****************************************************************

type EncryptedString struct {
	Data string
}

func (es *EncryptedString) Scan(value interface{}) error {
	env := os.Getenv("DB_SEC_ENC")
	if env == "" {
		env = "WJZexBWFSe4jnmpvIootu0tl2PYaI8eX"
	}
	key := []byte(env)
	ciphertext := value.([]byte)
	if len(ciphertext) == 0 {
		es.Data = ""
	}
	c, err := aes.NewCipher(key)
	if err != nil {
		fmt.Println(err)
		return err
	}
	gcm, err := cipher.NewGCM(c)
	if err != nil {
		fmt.Println(err)
		return err
	}
	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		fmt.Println(err)
		fmt.Println("CipherLenght: ",len(ciphertext))
		return errors.New("poink")
	}
	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	es.Data = string(plaintext)
	return nil
}

func (es EncryptedString) Value() (driver.Value, error) {
	text := []byte(es.Data)
	if len(text) == 0 {
		return text, nil
	}
	env := os.Getenv("DB_SEC_ENC")
	if env == "" {
		env = "WJZexBWFSe4jnmpvIootu0tl2PYaI8eX"
	}
	key := []byte(env)
	c, err := aes.NewCipher(key)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	gcm, err := cipher.NewGCM(c)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		fmt.Println(err)
		return nil, err
	}

	x := gcm.Seal(nonce, nonce, text, nil)
	return x, nil
}

//****************************************************************

func GetAgentHostAndPort() (string, string) {
	var agentHost, agentPort = "localhost", "23007"
	return agentHost, agentPort
}

func GetAgentProtocol() string {
	return "http"
}

func GetNistagramHostAndPort() (string, string) {
	var nistagramHost, nistagramPort = "localhost", "9090"
	return nistagramHost, nistagramPort
}

func GetNistagramProtocol() string {
	return "http"
}

func SendMail(sendTo string, subject string, mailMessage string) {
	from := os.Getenv("MAIL_USERNAME")
	password := os.Getenv("MAIL_PASSWORD")
	to := []string{sendTo}
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	msg := []byte("To: " + sendTo + "\r\n" + "Subject: " + subject + "\r\n" + "\r\n" + mailMessage + "\r\n")
	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, msg)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Email Sent Successfully!")
}

func Uint2String(input uint) string {
	return strconv.FormatUint(uint64(input), 10)
}

func String2Uint(input string) uint {
	u64, err := strconv.ParseUint(input, 10, 32)
	if err != nil {
		fmt.Println(err)
		return 0
	}
	return uint(u64)
}

func Contains(array []uint, el uint) bool {
	for _, a := range array {
		if a == el {
			return true
		}
	}
	return false
}

func GetFrontProtocol() string {
	return "http"
}

func GetFrontHostAndPort() (string, string) {
	var frontHost, frontPort = "localhost", "4200"
	return frontHost, frontPort
}

//****************************************************************

var agentJwt = ""

func SetJwt(token string) {
	agentJwt = strings.ReplaceAll(token, "\"", "")
}

func NistagramRequest(method string, urlPath string, data []byte, headers map[string]string) (*http.Response, error) {
	client := &http.Client{}
	nistagramHost, nistagramPort := GetNistagramHostAndPort()
	path := GetNistagramProtocol() + "://" + nistagramHost + ":" + nistagramPort
	req, err := http.NewRequest(method, path + urlPath, bytes.NewBuffer(data))
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+agentJwt)
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	return client.Do(req)
}

func GetResponseJSON(response http.Response) []byte{
	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println(err)
		return make([]byte, 0)
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(response.Body)
	return body
}
