# 넌적스 문법
## 1. 변수
### {{ }} 로 감싼다
```html
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>
<button class="{{title}}" type="submit">submit</button>
<input placeholder="{{title}} 연습"/>
```
### 내부에서 변수 사용 가능
> {% set 변수 = '값' %}
```html
<!-- 넌적스 -->
{% set node = 'Node.js' %}
{% set js = 'Javascript' %}
<p>{{node}} 와 {{js}}</p>
```
```html
<!-- HTML -->
<p>Node.js 와 Javascript</p>
```
### HTML 을 이스케이프 하지 않기
> {{ 변수 | safe }}
```html
<!-- 넌적스 -->
<p>{{'<strong>이스케이프</strong>'}}</p>
<p>{{'<strong>이스케이프하지 않음</strong>' | safe}}</p>
```
```html
<!-- HTML -->
<p>&lt;strong&gt;이스케이프&lt;/strong&gt;'}}</p>
<p><strong>이스케이프하지 않음</strong></p>
```
## 2. 반복문
> {% for in %}  
{% endfor %}  
for 문 내에서 인덱스 사용: *__loop.index__*
```html
<!-- 넌적스 -->
<ul>
    {% set fruits = ['사과', '배', '오렌지'] %}
    {% for item in fruits %}
    <li>{{loop.index}}}번째 {{item}}</li>
    {% endfor %}
</ul>
```
```html
<!-- HTML -->
<ul>
    <li>1번째 사과</li>
    <li>2번째 배</li>
    <li>3번째 오렌지</li>
</ul>
```

## 3. 조건문
>{% if 변수 %}  
{% elif %}  
{% else %}  
{% endif %} 
```html
<!-- 넌적스 -->
{% if isLoggedIn %}
<div>로그인 되었습니다.</div>
{% else %}
<div>로그인이 필요합니다.</div>
{% endif %}
```
```html
<!-- HTML -->
<!-- isLoggedIn: true -->
<div>로그인 되었습니다.</div>
<!-- isLoggedIn: false -->
<div>로그인이 필요합니다.</div>
```
> elif(else if 역할): 분기처리하기
```html
<!-- 넌적스 -->
{% if fruit === 'apple %}
<p>사과입니다.</p>
{% elif fruit === 'banana' %}
<p>바나나입니다.</p>
{% else %}
<p>사과도 바나나도 아닙니다.</p>
{% endif %}
```
```html
<!-- HTML -->
<!-- fruit: apple -->
<p>사과입니다.</p>
<!-- fruit: banana -->
<p>바나나입니다.</p>
<!-- fruit: melon -->
<p>사과도 바나나도 아닙니다.</p>
```

## 4. include
> 다른 HTML 파일을 넣을 수 있음  
```javascript
{% include 파일경로 %}
```

## 5. extends 와 block
> 레이아웃을 정할 수 있음  
공통되는 레이아웃 부분을 따로 관리  
include 와도 함께 사용하기도 함
- 블록 선언
> {% block [블록명] %}  
- block 이 되는 파일에서 레이아웃 파일 지정
> {% extends 경로 %}
- layout.html (nunjucks)
```html
<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
    <link rel="stylesheet" href="/sytle.css"/>
    {% block style %}
    {% endblock %}
</head>
<body>
    <header>헤더입니다.</header>
    {% block content %}
    {% endblock %}
    <footer>푸터입니다.</footer>
    {% block content %}
    {% endblock %}
</body>
</html>
```
- body.html (nunjucks)
```html
{% block content %}
<main>
    <p>내용입니다.</p>
</main>
{% endblock %}
{% block content %}
<script src="/main.js"></script>
{% endblock %}
```
- html
```html
<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
    <link rel="stylesheet" href="/sytle.css"/>
</head>
<body>
    <header>헤더입니다.</header>
    <main>
        <p>내용입니다.</p>
    </main>
    <footer>푸터입니다.</footer>
    <script src="/main.js"></script>
</body>
</html>
```
