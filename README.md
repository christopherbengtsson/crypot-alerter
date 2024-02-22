# RSI Divergence

- Regular Bullish Divergence: Occurs when the price makes a lower low, but the RSI makes a higher low. This indicates potential upward price movement.
- Regular Bearish Divergence: Happens when the price makes a higher high, but the RSI makes a lower high. This suggests potential downward price movement.
- Hidden Bullish Divergence: Seen when the price makes a higher low, but the RSI makes a lower low. It often indicates a continuation of an uptrend.
- Hidden Bearish Divergence: Occurs when the price makes a lower high, but the RSI makes a higher high. It often signals a continuation of a downtrend.

# Technical Requirements

- Type: Wilders
- RSI Source: Close
- RSI Length: 14
- RSI EMA Length: 12
- Lookback Bars: 28
- Confirmation Logic: Close below wick low for bearish / Close above wick high for bullish.


---------------------
RSI Settings:
Lengh: 14,
Source: close,

RSI Divergences:
bull price source: close,
bear price source: close,
divergence source: price,
low/high left bars: 3,
low/high right bars: 3,
minimal lookback bars: 1,
maximum lookback bars: 90,
lookback lows/highs: 28,
price threshold: 0,
RSI threshold: 1