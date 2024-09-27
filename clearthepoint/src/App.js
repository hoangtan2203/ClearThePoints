import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames';
import './App.css';

function App() {
  const inputRef = useRef(); // số lượng của bi điểm nhập từ input
  const [count, setCount] = useState(0 + '.0'); // bộ đếm thời gian
  const [isCounting, setIsCounting] = useState(false) 
  const [status, setStatus] = useState("LET'S PLAY") // trạng thái game tại thẻ H1
  const [pointBalls, setPointBalls] = useState([]); // danh sách bi điểm hiển thị trong màn hình
  const [button, setButton] = useState('Play'); // tình trạng của button
  const [nextBall, setNextBall] = useState(1); 
  const pointballSize = 40;

  // hàm tạo dãy số thêm vào mảng
  const handleStartGame = () => {
    const num = parseInt(inputRef.current.value); // chuyển thành số nguyên
    if (!isNaN(num) && num > 0) {
      const newArray = Array.from({ length: num }, (v, index) => ({
        index: index,
        id: index + 1,
        left: Math.random() * (550 - pointballSize), // 550 là chiều rộng của screen-point-balls
        top: Math.random() * (400 - pointballSize), // 400 là chiều cao của screen-point-balls
        isFading: false // hiệu ứng làm mờ
      })); // Tạo mảng từ 1 đến num
      setPointBalls(newArray); // Cập nhật mảng trong state
      setButton('Reset');
      setIsCounting(true)
      setNextBall(1);
    } else {
      setPointBalls([]); // Nếu không đúng giá trị số ( number ), trả về mảng rỗng
      setCount(0)
      // setIsCounting(false);
      setButton('Play')
    }
  }

  // bộ đếm thời gian khi start game
  useEffect(() => {
    let interval = null;
    if (isCounting) {
      interval = setInterval(() => {
        setCount((prev) => parseFloat((parseFloat(prev) + 0.1).toFixed(1))); // Tăng giây theo 0.1, thêm parseFloat() đển k bị lỗi giá trị
      }, 100); // Cập nhật mỗi 100ms
    }
    return () => clearInterval(interval);
  }, [isCounting]) 

  // hàm Play/Reset game
  const handleClickButton = () => {
    if (button == 'Reset') {
      inputRef.current.value = null;
      setPointBalls([]);
      setButton('Play');
      setStatus("LET'S PLAY")
      setIsCounting(false)
      setCount(0 + '.0')
    } else {
      handleStartGame()
      // setIsCounting(true)
    }
  }

  // hàm khi click vào các bi điểm
  const handleClickBalls = (id) => {

    if (id == nextBall) {
      const changeColorPointBalls = pointBalls.map((ball) => {
        if (ball.id == id) {
          return { ...ball, isFading: true }
        }
        return ball // **lưu ý
      });
      setPointBalls(changeColorPointBalls);

      // hàm setTimeout này hỗ trợ cho hiệu ứng chuyển màu của bi
      setTimeout(() => {
        const newPointBalls = pointBalls.filter(ball => ball.id !== id); // xóa đi phần tử ( bi ) được chọn khỏi mảng
        setPointBalls(newPointBalls);
        if (newPointBalls.length == 0) {
          setStatus('ALL CLEAN')
          setIsCounting(false)
        } else {
          setNextBall(nextBall + 1)
        }
      }, 300)
    } else {
      setStatus('GameOver');
      setIsCounting(false)
    }
  }
  return (
    <div className="App">
      <div className="container">
        <h1 className={classNames({
          'green-text': status == 'CLEAN ALL',
          'red-text': status == 'GameOver',
        })}>
          {status}
        </h1>
        <div className="setting">
          <div className="point-time">
            <p>points:</p>
            <p>time:</p>
          </div>
          <div className="input-timing">
            <input
              type="number"
              ref={inputRef}
              placeholder='maximum 99999'
            />
            <p>{count}s</p>
          </div>
        </div>
        <button onClick={handleClickButton}>{button}</button>
        <div className="screen-point-balls">
          {pointBalls.map((ball) => {
            return (
              <div
                className='point-balls'
                key={ball.id}
                style={{
                  left: ball.left, // đây là vị trí ngẫu nhiên theo chiều ngang
                  top: ball.top, // đây là vị trí ngẫu nhiên theo chiều dọc
                  backgroundColor: ball.isFading ? 'red' : '', // Đổi màu sang đỏ
                  opacity: ball.isFading ? '0.5' : '1', // Giảm độ mờ khi đang mờ dần
                  transition: 'opacity 1s ease-in-out',
                  zIndex: inputRef.current.value - ball.id, // đẩy những bi nhỏ lên ưu tiên
                  cursor: 'pointer'
                }}
                onClick={() => handleClickBalls(ball.id)}
              >
                <p className='number'>{ball.id}</p>
              </div>
            )
          })
          }
        </div>

      </div>
    </div>
  );
}

export default App;
