import XCTest
@testable import PrvioKit

final class WidgetContentTests: XCTestCase {
    private let snap = EstateSnapshot(
        estateName: "Prvio Estate", healthScore: 87, zones: 26, objects: 142,
        openTasks: 7, alerts: 3, maintenanceDue: 1, nextMaintenanceDays: 3,
        propertyValue: 2_400_000, appreciationPct: 4.2,
        weather: Weather(tempC: 22, condition: "Clear", icon: "☀️", high: 26, low: 14, source: "live"),
        security: .init(armed: true, cameras: 8, camerasOnline: 7, openDoors: 0),
        month: 6
    )

    func testFormatValueParity() {
        XCTAssertEqual(WidgetContent.formatValue(2_400_000), "€2.4M")
        XCTAssertEqual(WidgetContent.formatValue(3_000_000), "€3M")
        XCTAssertEqual(WidgetContent.formatValue(860_000), "€860K")
        XCTAssertEqual(WidgetContent.formatValue(420), "€420")
    }

    func testSeasonalChecklistByMonth() {
        XCTAssertEqual(WidgetContent.seasonalChecklist(month: 0).name, "Winter")
        XCTAssertEqual(WidgetContent.seasonalChecklist(month: 3).name, "Spring")
        XCTAssertEqual(WidgetContent.seasonalChecklist(month: 6).name, "Summer")
        XCTAssertEqual(WidgetContent.seasonalChecklist(month: 9).name, "Autumn")
    }

    func testPropertyStatusWidget() {
        let w = WidgetContent.build(.propertyStatus, from: snap)
        XCTAssertEqual(w.primary, "87")
        XCTAssertTrue(w.secondary?.contains("Very Good") ?? false)
        XCTAssertEqual(w.deepLink, "/")
    }

    func testSecurityReflectsArmedState() {
        XCTAssertEqual(WidgetContent.build(.security, from: snap).primary, "Armed")
        var disarmed = snap
        disarmed = EstateSnapshot(
            estateName: snap.estateName, healthScore: snap.healthScore, zones: snap.zones,
            objects: snap.objects, openTasks: snap.openTasks, alerts: snap.alerts,
            maintenanceDue: snap.maintenanceDue, nextMaintenanceDays: snap.nextMaintenanceDays,
            propertyValue: snap.propertyValue, appreciationPct: snap.appreciationPct,
            weather: snap.weather,
            security: .init(armed: false, cameras: 8, camerasOnline: 7, openDoors: 1),
            month: snap.month
        )
        XCTAssertEqual(WidgetContent.build(.security, from: disarmed).primary, "Disarmed")
    }
}
