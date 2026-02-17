import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/src/hooks/useTheme';
import { formatMeasure, type SystemResult } from '@/src/utils/calculations';

interface WindowDiagramProps {
  results: SystemResult;
  windowWidth: number;
  windowHeight: number;
  alas: number;
}

/** Horizontal dimension line with end caps and centered label */
function HDim({
  width,
  label,
  sublabel,
  lineColor,
  textColor,
  bgColor,
  style,
  opacity = 1,
}: {
  width: number;
  label: string;
  sublabel?: string;
  lineColor: string;
  textColor: string;
  bgColor: string;
  style?: object;
  opacity?: number;
}) {
  return (
    <View style={[styles.hDim, { width }, style]}>
      <View style={[styles.hLine, { backgroundColor: lineColor, opacity }]} />
      <View style={[styles.hCap, styles.hCapL, { backgroundColor: lineColor, opacity }]} />
      <View style={[styles.hCap, styles.hCapR, { backgroundColor: lineColor, opacity }]} />
      <View style={[styles.hLabel, { backgroundColor: bgColor }]}>
        <Text style={[styles.dimText, { color: textColor, opacity }]}>{label}</Text>
        {sublabel && (
          <Text style={[styles.dimSub, { color: textColor, opacity: opacity * 0.8 }]}>
            {sublabel}
          </Text>
        )}
      </View>
    </View>
  );
}

/** Vertical dimension line with end caps and centered label */
function VDim({
  height,
  lines,
  lineColor,
  textColor,
  bgColor,
}: {
  height: number;
  lines: { label: string; value: string }[];
  lineColor: string;
  textColor: string;
  bgColor: string;
}) {
  return (
    <View style={[styles.vDim, { height }]}>
      <View style={[styles.vLine, { backgroundColor: lineColor }]} />
      <View style={[styles.vCap, styles.vCapT, { backgroundColor: lineColor }]} />
      <View style={[styles.vCap, styles.vCapB, { backgroundColor: lineColor }]} />
      <View style={[styles.vLabel, { backgroundColor: bgColor }]}>
        {lines.map((l, i) => (
          <View key={i} style={i > 0 ? styles.vLabelGap : undefined}>
            <Text style={[styles.dimSub, { color: textColor }]}>{l.label}</Text>
            <Text style={[styles.dimText, { color: textColor }]}>{l.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function WindowDiagram({
  results,
  windowWidth,
  windowHeight,
  alas,
}: WindowDiagramProps) {
  const { colors, isDark } = useTheme();
  const screen = useWindowDimensions();

  // -- Zoom / pan --
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTX = useSharedValue(0);
  const savedTY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 0.5), 5);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .minPointers(1)
    .onUpdate((e) => {
      translateX.value = savedTX.value + e.translationX;
      translateY.value = savedTY.value + e.translationY;
    })
    .onEnd(() => {
      savedTX.value = translateX.value;
      savedTY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 250 });
      savedScale.value = 1;
      translateX.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(0, { duration: 250 });
      savedTX.value = 0;
      savedTY.value = 0;
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // -- Drawing proportions --
  const dimColW = 40;
  const sideCols = 3; // left: jamba | right: eng+trasl, alto
  const sideSpace = dimColW * sideCols;
  const maxDrawW = screen.width - 40 - sideSpace;
  const maxDrawH = 280;

  const ratio = windowWidth / windowHeight;
  let drawW: number;
  let drawH: number;
  if (ratio > maxDrawW / maxDrawH) {
    drawW = maxDrawW;
    drawH = maxDrawW / ratio;
  } else {
    drawH = maxDrawH;
    drawW = maxDrawH * ratio;
  }

  const framePx = Math.max(drawW * 0.04, 4);
  const innerW = drawW - framePx * 2;
  const gap = 2;
  const panelW = (innerW - gap * (alas - 1)) / alas;

  const lineColor = colors.tint;
  const dimColor = colors.tint;
  const frameColor = colors.text;
  const glassColor = isDark ? '#23282c' : '#e8f0f8';
  const labelBg = colors.surface;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Vista de ventana
      </Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Pellizca para zoom / doble toque para restablecer
      </Text>

      <View style={styles.clipArea}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.zoomLayer, animatedStyle]}>
            <View style={styles.diagram}>
              {/* ---- Top: Cabezal ---- */}
              <HDim
                width={drawW}
                label={`Cabezal: ${formatMeasure(results.cabezal)} cm`}
                lineColor={lineColor}
                textColor={dimColor}
                bgColor={labelBg}
              />

              {/* ---- Middle: side dims + frame ---- */}
              <View style={styles.middle}>
                {/* Left: Jamba */}
                <VDim
                  height={drawH}
                  lines={[
                    { label: 'Jamba', value: `${formatMeasure(results.jamba)} cm` },
                  ]}
                  lineColor={lineColor}
                  textColor={dimColor}
                  bgColor={labelBg}
                />

                {/* Window frame */}
                <View
                  style={{
                    width: drawW,
                    height: drawH,
                    borderWidth: framePx,
                    borderColor: frameColor,
                    borderRadius: 2,
                  }}
                >
                  <View style={styles.panelsRow}>
                    {Array.from({ length: alas }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.panel,
                          {
                            width: panelW,
                            backgroundColor: glassColor,
                            borderColor: frameColor,
                            marginLeft: i > 0 ? gap : 0,
                          },
                        ]}
                      >
                        <Text style={[styles.panelDim, { color: colors.textSecondary }]}>
                          {formatMeasure(results.vidrio_ancho)} x{' '}
                          {formatMeasure(results.vidrio_alto)}
                        </Text>
                        <Text style={[styles.panelName, { color: colors.textSecondary }]}>
                          Vidrio
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Right inner: Enganche + Traslape */}
                <VDim
                  height={drawH}
                  lines={[
                    { label: 'Enganche', value: `${formatMeasure(results.eganche)} cm` },
                    { label: 'Traslape', value: `${formatMeasure(results.traslape)} cm` },
                  ]}
                  lineColor={lineColor}
                  textColor={dimColor}
                  bgColor={labelBg}
                />

                {/* Right outer: Alto total */}
                <VDim
                  height={drawH}
                  lines={[
                    { label: 'Alto', value: `${windowHeight} cm` },
                  ]}
                  lineColor={lineColor}
                  textColor={dimColor}
                  bgColor={labelBg}
                />
              </View>

              {/* ---- Bottom: Sillar ---- */}
              <HDim
                width={drawW}
                label={`Sillar: ${formatMeasure(results.sillar)} cm`}
                lineColor={lineColor}
                textColor={dimColor}
                bgColor={labelBg}
              />

              {/* ---- Horizontal: one panel width ---- */}
              <HDim
                width={panelW + framePx}
                label={`Horizontal: ${formatMeasure(results.horizontal)} cm`}
                lineColor={lineColor}
                textColor={dimColor}
                bgColor={labelBg}
                style={{ alignSelf: 'flex-start', marginLeft: dimColW }}
                opacity={0.7}
              />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 16,
    paddingHorizontal: 18,
  },
  hint: {
    fontSize: 12,
    paddingHorizontal: 18,
    marginTop: 2,
    marginBottom: 12,
  },
  clipArea: {
    overflow: 'hidden',
    minHeight: 340,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  zoomLayer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagram: {
    alignItems: 'center',
  },

  // -- Middle row --
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // -- Panels --
  panelsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelDim: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  panelName: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },

  // -- Horizontal dimension --
  hDim: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    top: 11,
  },
  hCap: {
    position: 'absolute',
    width: 1,
    height: 8,
    top: 8,
  },
  hCapL: { left: 0 },
  hCapR: { right: 0 },
  hLabel: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    zIndex: 1,
  },

  // -- Vertical dimension --
  vDim: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    left: 19,
  },
  vCap: {
    position: 'absolute',
    height: 1,
    width: 8,
    left: 16,
  },
  vCapT: { top: 0 },
  vCapB: { bottom: 0 },
  vLabel: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 3,
    zIndex: 1,
  },
  vLabelGap: {
    marginTop: 6,
  },

  // -- Text --
  dimText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  dimSub: {
    fontSize: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
});
