function CustomSelector({ onChange, items, selected }) {
    return (
      <select
        id="custom-select"
        name="custom-select"
        className="flex items-center bg-tychePrimary text-white text-[14px] md:text-[16px] pl-3 pr-12 md:pl-6 py-1 min-h-[50px] rounded-full w-fit focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen appearance-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/9/9d/Caret_down_font_awesome_whitevariation.svg')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px_12px] cursor-pointer"
        onChange={onChange}
      >
        {items.map((item) => {
          const [key, value] = Object.entries(item)[0]; // key-value çiftini ayırır
          return (
            <option key={key} value={key} selected={selected === key}>
              {value}
            </option>
          );
        })}
      </select>
    );
}

export default CustomSelector;