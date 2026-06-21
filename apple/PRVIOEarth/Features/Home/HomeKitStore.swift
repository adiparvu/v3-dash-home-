import Foundation

/// Bridges Apple Home (HomeKit) into the app: lists the accessories from the
/// user's homes, exposes a power toggle for the ones that support it, and falls
/// back to demo data when HomeKit is unavailable, unauthorized, or empty.
///
/// HomeKit is unavailable on Mac Catalyst, so on that platform this is a
/// demo-only stub with the same surface. Everywhere else (iPhone, iPad,
/// Vision, watch) it talks to `HMHomeManager`.
#if canImport(HomeKit) && !targetEnvironment(macCatalyst)
import HomeKit

@MainActor
@Observable
final class HomeKitStore {
    private(set) var accessories: [HomeAccessory] = DemoData.homeAccessories
    private(set) var source: EstateStore.Source = .demo
    /// True once the user has granted HomeKit access for this app.
    private(set) var authorized = false

    private var manager: HMHomeManager?
    private var delegate: Delegate?
    /// Maps an accessory id to its writable power-state characteristic (toggle).
    private var powerChars: [String: HMCharacteristic] = [:]

    /// Lazily create the home manager (this triggers the HomeKit permission
    /// prompt the first time) and refresh the accessory list.
    func start() {
        guard manager == nil else { refresh(); return }
        let d = Delegate(store: self)
        delegate = d
        let m = HMHomeManager()
        m.delegate = d
        manager = m
        refresh()
    }

    /// Flip the power state of an accessory that exposes a power characteristic.
    func toggle(_ accessory: HomeAccessory) {
        guard let characteristic = powerChars[accessory.id],
              let current = accessory.isOn else { return }
        characteristic.writeValue(!current) { [weak self] error in
            guard error == nil else { return }
            Task { @MainActor in self?.refresh() }
        }
    }

    fileprivate func refresh() {
        guard let manager else { return }
        authorized = manager.authorizationStatus.contains(.authorized)

        var items: [HomeAccessory] = []
        var chars: [String: HMCharacteristic] = [:]

        for home in manager.homes {
            for accessory in home.accessories {
                let id = accessory.uniqueIdentifier.uuidString
                let room = home.rooms.first { $0.accessories.contains(accessory) }?.name
                let power = powerCharacteristic(in: accessory)
                if let power { chars[id] = power }
                items.append(HomeAccessory(
                    id: id,
                    name: accessory.name,
                    room: room,
                    category: label(for: accessory.category.categoryType),
                    isReachable: accessory.isReachable,
                    isOn: power?.value as? Bool
                ))
            }
        }

        powerChars = chars
        if items.isEmpty {
            accessories = DemoData.homeAccessories
            source = .demo
        } else {
            accessories = items.sorted { $0.name < $1.name }
            source = .synced
        }
    }

    private func powerCharacteristic(in accessory: HMAccessory) -> HMCharacteristic? {
        for service in accessory.services {
            for characteristic in service.characteristics
            where characteristic.characteristicType == HMCharacteristicTypePowerState {
                return characteristic
            }
        }
        return nil
    }

    private func label(for categoryType: String) -> String {
        switch categoryType {
        case HMAccessoryCategoryTypeLightbulb: return "Lightbulb"
        case HMAccessoryCategoryTypeOutlet: return "Outlet"
        case HMAccessoryCategoryTypeSwitch: return "Switch"
        case HMAccessoryCategoryTypeThermostat: return "Thermostat"
        case HMAccessoryCategoryTypeSensor: return "Sensor"
        case HMAccessoryCategoryTypeDoor, HMAccessoryCategoryTypeDoorLock: return "Door"
        case HMAccessoryCategoryTypeGarageDoorOpener: return "Garage"
        case HMAccessoryCategoryTypeWindow, HMAccessoryCategoryTypeWindowCovering: return "Window"
        case HMAccessoryCategoryTypeFan: return "Fan"
        case HMAccessoryCategoryTypeIPCamera, HMAccessoryCategoryTypeVideoDoorbell: return "Camera"
        default: return "Accessory"
        }
    }

    /// Delegate shim — `HMHomeManagerDelegate` requires an `NSObject`, which the
    /// `@Observable` store is not, so the callbacks are forwarded here.
    private final class Delegate: NSObject, HMHomeManagerDelegate {
        weak var store: HomeKitStore?
        init(store: HomeKitStore) { self.store = store }
        func homeManagerDidUpdateHomes(_ manager: HMHomeManager) {
            Task { @MainActor in self.store?.refresh() }
        }
        func homeManager(_ manager: HMHomeManager, didUpdate status: HMHomeManagerAuthorizationStatus) {
            Task { @MainActor in self.store?.refresh() }
        }
    }
}

#else

// Mac Catalyst (and any platform without HomeKit): demo-only stub.
@MainActor
@Observable
final class HomeKitStore {
    private(set) var accessories: [HomeAccessory] = DemoData.homeAccessories
    private(set) var source: EstateStore.Source = .demo
    private(set) var authorized = false
    func start() {}
    func toggle(_ accessory: HomeAccessory) {}
}

#endif
