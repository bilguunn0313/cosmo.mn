import { adapterConnectionString } from './adapter-connection-string';

describe('adapterConnectionString', () => {
  it('MySQL 8-ийн нэвтрэлтэд allowPublicKeyRetrieval нэмнэ', () => {
    expect(
      adapterConnectionString('mysql://cosmo:secret@localhost:3306/cosmo'),
    ).toBe(
      'mysql://cosmo:secret@localhost:3306/cosmo?allowPublicKeyRetrieval=true',
    );
  });

  it('байгаа тохиргоог өөрчлөхгүй', () => {
    expect(
      adapterConnectionString(
        'mysql://cosmo:secret@db:3306/cosmo?allowPublicKeyRetrieval=false',
      ),
    ).toBe('mysql://cosmo:secret@db:3306/cosmo?allowPublicKeyRetrieval=false');
  });
});
