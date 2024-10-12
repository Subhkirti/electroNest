const navigation = {
  categories: [
    {
      id: "televisions-accessories",
      name: "Televisions & accessories",
      sections: [
        {
          id: "led-tvs",
          name: "LED TVs",
          items: [
            { name: "All LED Tvs", id: "all-led-tvs" },
            { name: "QLED", id: "qled-tvs" },
            { name: "OLED TVs", id: "oled-tvs" },
            { name: "4K Ultra HD TVs", id: "4k-ultra-hd-tvs" },
            { name: "8K Ultra HD TVs", id: "8k-ultra-hd-tvs" },
            { name: "Smart TVs", id: "smart-tvs" },
            { name: "Full HD TVs", id: "full-hd-tvs" },
            { name: "Large Screen TVs", id: "large-screen-tvs" },
            { name: "Small Screen TVs", id: "small-screen-tvs" },
          ],
        },
        {
          id: "tv-accessories",
          name: "TV accessories ",
          items: [
            { name: "All TV Accessories", id: "all-tv-accessories" },
            { name: "V Wall Mount & Stands", id: "tv-wall-mount-stands" },
            { name: "Cables & Connectors", id: "cables-connectors" },
            { name: "Remotes & IR Blasters", id: "remotes-ir-blasters" },
          ],
        },
        {
          id: "projectors",
          name: "Projectors",
          items: [
            { name: "Short Throw Projectors", id: "short-throw-projectors" },
            {
              name: "Ultra Short Throw Projectors",
              id: "ultra-short-throw-projectors",
            },
            { name: "Full HD Projectors", id: "full-hd-projectors" },
            { name: "Ultra HD 4K Projectors", id: "ultra-hd-4k-projector" },
          ],
        },
      ],
    },
    {
      id: "home-appliances",
      name: "Home Appliances",

      sections: [
        {
          id: "washing-machines-dryers",
          name: "Washing Machines & Dryers",
          items: [
            {
              name: "Front Load Washing Machines",
              id: "front-load-washing-machines",
            },
            {
              name: "Top Load Washing Machines",
              id: "top-load-washing-machines",
            },
            {
              name: "Semi Automatic Washing Machines",
              id: "semi-automatic-washing-machines",
            },
          ],
        },
        {
          id: "air-conditioners",
          name: "Air Conditioners",
          items: [
            { name: "Inverter ACs", id: "inverter-acs" },
            { name: "Portable ACs", id: "portable-acs" },
            { name: "Split ACs", id: "split-acs" },
          ],
        },
        {
          id: "refrigerators",
          name: "Refrigerators & Freezers",
          items: [
            {
              name: "Single Door Refrigerators",
              id: "single-door-refrigerators",
            },
            {
              name: "Double Door Refrigerators",
              id: "double-door-refrigerators",
            },
            {
              name: "Side By Side Refrigerators",
              id: "side-by-side-refrigerators",
            },
            { name: "Wine Coolers", id: "wine-coolers" },
          ],
        },
        {
          id: "lighting-products",
          name: "Lighting Products",
          items: [
            { name: "Light Strips", id: "light-strips" },
            { name: "Table Lamps", id: "table-lamps" },
            { name: "Torches", id: "torches" },
            { name: "Solar Lights", id: "solar-lights" },
            { name: "Sensor Lights", id: "sensor-lights" },
          ],
        },
        {
          id: "fans",
          name: "Fans",
          items: [
            { name: "Exhaust Fans", id: "exhaust-fans" },
            { name: "Pedestal Fans", id: "pedestal-fans" },
            { name: "Table Fans", id: "table-fans" },
            { name: "Tower Fans", id: "tower-fans" },
            { name: "Wall Mount Fans", id: "wall-mount-fans" },
            { name: "Ceiling Fans", id: "ceiling-fans" },
            { name: "Smart Fans", id: "smart-fans" },
          ],
        },
      ],
    },
    {
      id: "phones-wearables",
      name: "Phones & Wearables",
      sections: [
        {
          id: "mobile-phones",
          name: "Mobile Phones",
          items: [
            { name: "Android Phones", id: "android-phones" },
            { name: "iPhones", id: "iphones" },
            {
              name: "Flip and Fold Mobile Phones",
              id: "flip-and-fold-mobile-phones",
            },
            { name: "Gaming Mobile Phones", id: "gaming-mobile-phones" },
          ],
        },
        {
          id: "headphones-earphones",
          name: "Headphones & Earphones",
          items: [
            { name: "Bluetooth Earphones", id: "bluetooth-earphones" },
            { name: "Bluetooth Headphones", id: "bluetooth-headphones" },
            { name: "Truly Wireless Earbuds", id: "wireless-earbuds" },
            { name: "Bluetooth", id: "bluetooth" },
            { name: "Headphones", id: "headphones" },
          ],
        },
        {
          id: "wearables",
          name: "Wearables",
          items: [
            { name: "Smart Bands", id: "smart-bands" },
            { name: "Smartwatches", id: "smartwatches" },
            { name: "Smart Rings", id: "smart-rings" },
            { name: "VR Headsets", id: "vr-headsets" },
          ],
        },
      ],
    },
    {
      id: "computers-tablets",
      name: "Computers & Tablets",
      sections: [
        {
          id: "laptops",
          name: "Laptops",
          items: [
            { name: "Windows Laptops", id: "windows-laptops" },
            { name: "MacBooks", id: "macbooks" },
            { name: "2-In-1 Laptops", id: "2-in-1-laptops" },
            { name: "Ultra Thin Laptops", id: "ultra-thin-laptops" },
          ],
        },
        {
          id: "tablets-e-readers",
          name: "Tablets & eReaders",
          items: [
            { name: "Android Tablets", id: "android-tablets" },
            { name: "Windows Tablets", id: "windows-tablets" },
            { name: "iPads", id: "ipads" },
            { name: "Kindles", id: "kindles" },
            { name: "Digital Pads", id: "digital-pads" },
          ],
        },
        {
          id: "network-components",
          name: "Network Components",
          items: [
            { name: "Wi-Fi Routers", id: "wifi-routers" },
            { name: "Network Adapters", id: "network-adapters" },
            { name: "Mesh Routers", id: "mesh-routers" },
            { name: "Range Extenders", id: "range-extenders" },
            { name: "Network Switches", id: "network-switches" },
          ],
        },
        {
          id: "printers",
          name: "Printers",
          items: [
            { name: "Inkjet Printers", id: "inkjet-printers" },
            { name: "Portable Photo Printers", id: "portable-photo-printers" },
            { name: "Ink, Toner & Cartridges", id: "ink-toner-cartridges" },
            { name: "Ink Tank Printers", id: "ink-tank-printers" },
            { name: "Printer Papers", id: "printer-papers" },
          ],
        },
        {
          id: "computer-laptop-accessories",
          name: "Computer and Laptop Accessories",
          items: [
            { name: "Keyboards", id: "keyboards" },
            { name: "Mice", id: "mice" },
            {
              name: "Batteries, Chargers & Adapters",
              id: "batteries-chargers-adapter",
            },
            { name: "Laptop Bags", id: "laptop-bags" },
            { name: "Laptop Webcams & Mics", id: "laptop-webcams-mics" },
          ],
        },
      ],
    },
  ],
};

export default navigation;
