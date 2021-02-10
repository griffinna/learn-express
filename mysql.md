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
# users
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
    DEFAULT CHARACTER SET = utf8;

# comment
create table nodejs.comments (
    id int not null auto_increment,
    commenter int not null,
    comment varchar(100) not null,
    create_at datetime not null default now(),
    primary key(id),
    index commenter_idx (commenter ASC),
    constraint commenter            # constraint [제약조건명]
    foreign key (commenter)         # foreign key [컬럼명]
    references nodejs.users (id)    # references [참고하는 컬럼명]
    on delete cascade           # 사용자 정보가 삭제되면 연결 댓글 정보도 삭제
    on update cascade)          # 사용자 정보가 수정되면 연결 댓글 정보도 수정
    comment = '댓글'
    default charset = utf8mb4
    engine=InnoDB;
```
## 테이블 확인
```sql
DESC users;
```
``` console
+-----------+--------------+------+-----+-------------------+-------------------+
| Field     | Type         | Null | Key | Default           | Extra             |
+-----------+--------------+------+-----+-------------------+-------------------+
| id        | int          | NO   | PRI | NULL              | auto_increment    |
| name      | varchar(20)  | NO   | UNI | NULL              |                   |
| age       | int unsigned | NO   |     | NULL              |                   |
| married   | tinyint      | NO   |     | NULL              |                   |
| comment   | text         | YES  |     | NULL              |                   |
| create_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-----------+--------------+------+-----+-------------------+-------------------+
```

```sql
SHOW TABLES;
```
``` console
+------------------+
| Tables_in_nodejs |
+------------------+
| comments         |
| users            |
+------------------+
```

## 테이블 삭제
```sql
DROP TABLE users;
```

## 자료형
- INT: 정수  
소수까지 저장하려면 FLOAT, DOUBEL 자료형 사용
- VARCHAR(자릿수): 가변 길이 문자열
- CHAR(자릿수): 고정 길이 문자열 (자릿수보다 짧은 문자열을 넣으면 부족한 자릿수만큼 스페이스 채워짐)
- TEXT: 긴 글을 저장할 때 사용 (수백자 이내: VARCHAR 사용)
- TINYINT: -128 ~ 127 까지의 정수를 저장할 때 사용  
(1 또는 0 만 저장한다면 boolean 과 같은 역할)
- DATETIME: 날짜와 시간에 대한 정보
- DATE: 날짜 정보
- TIME: 시간정보

## 컬럼 옵션
- NULL / NOT NULL: 빈칸을 허용할지 여부 
- AUTO_INCREMENT: 숫자 자동 증가
- UNSIGNED: (숫자 자료형에 적용) 음수는 무시되고 양수만 저장  
*FLOAT, DOUBLE 에는 UN적용이 불가*
- ZEROFILL: 숫자의 자릿수가 고정되어 있을 때 사용 (비어있는 자리에 모두 0을 넣음)  
EX) INT(4) 컬럼에 1 을 넣으면 0001 이 됨
- DEFAULT: 저장 시 해당 컬럼에 값이 없다면 기본값을 넣음
- PRIMARY KEY: 해당 컬럼이 기본 키인 경우 설정
- UNIQUE INDEX: 해당 값이 고유해야 하는지에 대한 옵션

## 테이블 설정 옵션
- COMMENT: 테이블에 대한 보충 설명 (필수X)
- DEFAULT CHARACTER SET: utf8 로 설정하지 않으면 한글 입력 불가
- ENGINE: MyISAM 과 InnoDB 가 제일 많이 사용됨