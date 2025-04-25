import { forwardRef } from 'react';

const Header = forwardRef<HTMLElement>((_, ref) => (
    <header
        ref={ref}
        className="w-full bg-white rounded-b-[40px] shadow-md text-center py-4 z-10"
    >
        <h1 className="font-wedges text-2xl text-black">STOOPID GAME</h1>
    </header>
));

Header.displayName = 'Header';

export default Header;