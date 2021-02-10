# MySQL
- MAC 설치 (Homebrew)
```shell
$ brew install mysql
$ brew services start mysql
$ mysql_secure_installation
```
- MySQL 접속
```shell
$ mysql -h localhost -u root -p
Enter password: 
mysql> 
```
# MySQL Workbench
- 설치
```shell
# cask : GUI 기반의 어플리케이션 (ex. 크롬, atom 등) 설치
$ brew install cask

$ brew install cask mysqlworkbench
```
> mac OS Big Sur 11.2 에서 Workbench 8.0.23 이상 버전 실행 불가  

- 커넥션 생성
    * Connection Name: localhost
    * Password: Store in Vault

## 데이터베이스 생성
```sql
mysql> CREATE SCHEMA `nodejs` DEFAULT CHARACTER SET utf8;
Query OK, 1 row affected, 1 warning (0.00 sec)

mysql> use nodejs;
Database changed
```
## 테이블 생성
```sql
CREATE TABLE nodejs.users (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    age INT UNSIGNED NOT NULL,
    married TINYINT NOT NULL,
    comment TEXT NULL,
    create_at DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY(id),
    UNIQUE INDEX name_UNIQUE (name ASC))
    COMMENT = '사용자 정보'
    DEFAULT CHARACTER SET = utf8
    ;
```