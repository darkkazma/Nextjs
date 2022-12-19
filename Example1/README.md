TypeScript

> Javascript는 5-'3' 이 통한다. dynamic typing 이 가능하기 때문에...(자유도, 유연성...때문에)   
> TypeScript는 에러를 발생 한다.

> 에러 메시지의 퀄리티가 좋아 진다.

설치는 아래와 같이 진행 한다.
---   

1. nodejs 설치
2. visual studio code 설치
3. terminal 창에 아래 입력   
   `npm install -g typescript`
4. index.ts 파일 생성
5. 파일을 새로 만든다. `tsconfig.json`   
   `{   
   "compilerOptions": {   
   "target" : "es6",   
   "module" : "commonjs",   
   } }`
6. ts파일을 js로 변환해야 한다.
7. terminal 창에 아래 명령어 입력   
   `tsc -w`

React Life Cycle
---
> Mount
> > componentDidMount
> > > 컴포넌트를 만들고 첫 렌더링을 마친 후 실행 된다. 함수형 Hooks에서는 useEffect를 활용하여 기능을 구현 한다.

``` javascript 
// Class
 class Example extends React.Component {
     componentDidMount(){
       ...
   }
 }
 
 // Hooks
 const Example = () => {
   useEffect(() => {
      ...
   }, []);
 }
 ```

> Updating
> > componentDidUpdate
> > > 리렌더링을 완료 후 실행 된다. 업데이트가 끝난 직후 이므로, DOM 관련 처리를 진행.

``` javascript
// Class
class Example extends React.Component {
  componentDidUpdate(prevProps, prevState){
    ...
  }
}

// Hooks
const Example = () => {
  useEffect(() => {
    ...
  },[]);
}
```

> Unmounting
> > componentWillUnmount
> > > 컴포넌트를 DOM에서 제거할 떄 실행. componentDidMount에서 등록한 이벤트가 있다면 여기서 작업.

``` javascript
// Class
class Example extends React.Component {
   componentWillUnmount(){
      ...
   }
}

// Hooks
const Example = () => {
   useEffect(() => {
      return () => {
         ...
      }
   },[]);
}

```

- constructor   
  컴포넌트를 만들때 처음 실행 됨.

``` javascript
// Class
class Example extends React.Component {   
   constructor(props) {   
      super(props);   
      this.state = { count : 0 };   
}

// Hooks
const Example = () => {
  const[count, setCount] = useState(0);
}
```

- getDerivedStateFromPops   
  props로 받아 온 값을 state에 동기화 시키는 용도로 사용되며, 컴포넌트가 마운트될 때와 업데이트 될 때 호출된다.


- shoudComponentUpdate   
  props나 state를 변경 했을 때, 리렌더링을 할지 말지 결정하는 메서드   
  이 메서드에서는 반드시 true나 false를 반환해야 한다. 이 메서드는 오직 성능 최적화만을 위한 것.


- render   
  가장 기초적인 메서드 이기도 하며 중요한 메서드.    
  컴포넌트를 랜더링할 때 필요한 메서드. 함수형 컴포넌트에서는 render를 안쓰고 컴포넌트를 렌더링 할 수 있다.   



